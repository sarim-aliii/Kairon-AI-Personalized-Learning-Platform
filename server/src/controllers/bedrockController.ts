import { Request, Response } from 'express';
import StudyProject from '../models/StudyProject';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

import ytdl from '@distube/ytdl-core';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { YoutubeTranscript } from 'youtube-transcript';

const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_BEDROCK_REGION || "us-east-1"
});

const defaultModelName = 'us.amazon.nova-2-lite-v1:0';

const MATH_INSTRUCTION = "Always format mathematical equations using LaTeX syntax (e.g., $E=mc^2$ for inline, $$E=mc^2$$ for block equations). Do not use plain text for math formulas.";

// Helper Function
const getProjectForUser = async (projectId: string, userId: string) => {
    const project = await StudyProject.findById(projectId);
    if (!project) {
        throw { status: 404, message: 'Project not found' };
    }
    if (project.owner.toString() !== userId.toString()) {
        throw { status: 401, message: 'Not authorized to access this project' };
    }
    return project;
};

const getPersonaInstruction = (persona: string) => {
    switch (persona) {
        case 'Socratic Mentor':
            return "You are a Socratic Mentor. Never give the answer directly. Instead, ask guiding questions to help the student discover the answer themselves. Encourage critical thinking.";
        case 'ELI5 Buddy':
            return "You are an ELI5 Buddy. Explain complex concepts using simple analogies and language suitable for a 5-year-old. Keep it fun, simple, and easy to understand.";
        case 'Strict Professor':
            return "You are a Strict Professor. Demand precision and academic rigor. Point out exactly what the student got wrong. Do not tolerate vague or informal answers. Be critical but constructive.";
        case 'Philosopher':
            return "You are a Philosopher. Connect the topic to broader existential questions, ethics, and the nature of reality. Use a contemplative tone.";
        default:
            return "You are a helpful and knowledgeable AI tutor. Provide clear, accurate, and supportive explanations.";
    }
};

const downloadAudioBuffer = async (url: string): Promise<{ buffer: Buffer, mimeType: string }> => {
    if (!ytdl.validateURL(url)) {
        throw new Error("Invalid YouTube URL");
    }

    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'lowestaudio', filter: 'audioonly' });
    const mimeType = format.mimeType?.split(';')[0] || 'audio/mp3';

    const stream = ytdl(url, { 
        quality: 'lowestaudio', 
        filter: 'audioonly' 
    });

    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    
    return {
        buffer: Buffer.concat(chunks),
        mimeType: mimeType
    };
};

function cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function chunkText(text: string, chunkSize: number = 1000): string[] {
    if (!text) return [];
    const chunks = [];
    let currentChunk = "";
    const sentences = text.split(/(?<=[.?!])\s+/);

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length > chunkSize) {
            chunks.push(currentChunk);
            currentChunk = sentence;
        } else {
            currentChunk += (currentChunk ? " " : "") + sentence;
        }
    }
    if (currentChunk) chunks.push(currentChunk);
    return chunks;
}

// ==================== BEDROCK API CALL HELPER ====================

interface BedrockParams {
    modelId: string;
    body: string;
}

const invokeBedrockModel = async (params: BedrockParams): Promise<any> => {
    const command = new InvokeModelCommand({
        modelId: params.modelId,
        body: params.body
    });
    
    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(response.body.transformToString());
    
    // Nova format: response["output"]["message"]["content"]
    if (responseBody.output?.message?.content) {
        const contentList = responseBody.output.message.content;
        const textBlock = contentList.find((item: any) => item.text);
        if (textBlock) {
            return { content: [{ text: textBlock.text }] };
        }
    }
    
    return responseBody;
};

// ==================== CONTROLLER FUNCTIONS ====================

export const generateSummary = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const { projectId, language, llm } = req.body;
    try {
        const project = await getProjectForUser(projectId, req.user.id);
        const prompt = `Summarize the following text in ${language}. Provide a concise but comprehensive overview of the key points.\n\nTEXT:\n${project.ingestedText}`;

        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [
                    {
                        role: "user",
                        content: [{ text: prompt }]
                    }
                ],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        res.json(responseBody.content[0].text);
    } catch (error: any) {
        res.status(error.status || 500).json({ message: error.message || 'Failed to generate summary' });
    }
};

export const generateFlashcards = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const { projectId, language, llm } = req.body;
    try {
        const project = await getProjectForUser(projectId, req.user.id);
        const prompt = `Based on the following text, generate a JSON array of 5-10 flashcards in ${language}. Each flashcard should be an object with a "question" (string) and "answer" (string) property.\n\nTEXT:\n${project.ingestedText}`;

        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [
                    {
                        role: "user",
                        content: [{ text: prompt }]
                    }
                ],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        const text = responseBody.content[0].text.replace(/```json/g, '').replace(/```/g, '');
        res.json(JSON.parse(text));
    } catch (error: any) {
        res.status(error.status || 500).json({ message: error.message || 'Failed to generate flashcards' });
    }
};

export const getTutorResponse = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const { projectId, message, history, language, llm, persona } = req.body;
    try {
        const project = await getProjectForUser(projectId, req.user.id);
        const context = `CONTEXT: ${project.ingestedText.substring(0, 500000)}\n\n`;

        const messages = [
            ...(history || []).map((h: any) => ({
                role: h.role,
                content: [{ text: h.content }]
            })),
            {
                role: "user",
                content: [{ text: `${context}Based on the context above and our conversation history, answer my latest question in ${language}.\n\nLATEST QUESTION:\n${message}` }]
            }
        ];

        const systemInstruction = getPersonaInstruction(persona);

        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: messages,
                system: [{ text: systemInstruction + "\n\n" + MATH_INSTRUCTION }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        res.json(responseBody.content[0].text);
    } catch (error: any) {
        res.status(error.status || 500).json({ message: error.message || 'Tutor failed to respond' });
    }
};

export const generateConceptMap = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const { projectId, llm } = req.body;
    try {
        const project = await getProjectForUser(projectId, req.user.id);
        const prompt = `Analyze the following text and generate a concept map. Identify the main concepts and their relationships. Return a JSON object with 'nodes' and 'links'. Each node should have an 'id' (the concept name) and a 'group' (a number for color-coding related concepts). Each link should have a 'source' (node id), a 'target' (node id), and a 'value' (representing the strength of the connection, from 1 to 10).\n\nTEXT:\n${project.ingestedText}`;

        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        const text = responseBody.content[0].text.replace(/```json/g, '').replace(/```/g, '');
        res.json(JSON.parse(text));
    } catch (error: any) {
        res.status(error.status || 500).json({ message: error.message || 'Failed to generate concept map' });
    }
};

export const generateLessonPlan = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const { projectId, topic, llm } = req.body;
    try {
        const project = await getProjectForUser(projectId, req.user.id);
        const prompt = `Based on the following text content, create a detailed 50-minute lesson plan about "${topic}". The plan should be structured as a JSON object with keys: 'title', 'objective', 'duration' (string), 'materials' (array of strings), 'activities' (array of objects with 'name', 'duration', and 'description'), and 'assessment'.\n\nTEXT:\n${project.ingestedText}`;

        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        const text = responseBody.content[0].text.replace(/```json/g, '').replace(/```/g, '');
        res.json(JSON.parse(text));
    } catch (error: any) {
        res.status(error.status || 500).json({ message: error.message || 'Failed to generate lesson plan' });
    }
};

export const generateStudyPlan = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const { projectId, days, llm } = req.body;
    try {
        const project = await getProjectForUser(projectId, req.user.id);
        const prompt = `Create a ${days}-day study plan based on the provided text. The output should be a JSON object with 'title', 'durationDays', and a 'schedule' array. Each item in the schedule should be an object with 'day' (number), 'topic' (string), and 'tasks' (array of strings).\n\nTEXT:\n${project.ingestedText}`;

        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        const text = responseBody.content[0].text.replace(/```json/g, '').replace(/```/g, '');
        res.json(JSON.parse(text));
    } catch (error: any) {
        res.status(error.status || 500).json({ message: error.message || 'Failed to generate study plan' });
    }
};

export const extractTextFromFile = async (req: Request, res: Response) => {
    const { llm, base64Data, fileType } = req.body;
    
    if (!base64Data) return res.status(400).json({ message: "No file data provided." });
    
    try {
        let promptText = "Extract all text from this file. Respond only with the extracted text.";
        
        if (fileType.startsWith('image/')) {
            promptText = "Analyze this image. If it contains text or handwritten notes, transcribe them accurately. If it contains diagrams or charts, describe them in detail so the information can be used for study.";
        }

        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [
                    {
                        role: "user",
                        content: [{ text: promptText }]
                    }
                ],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        res.json(responseBody.content[0].text);
    } catch (error: any) {
        res.status(500).json({ message: `Failed to extract text: ${error.message}` });
    }
};

export const generateMCQs = async (req: Request, res: Response) => {
    const { llm, text, language, difficulty, numQuestions } = req.body;
    try {
        const count = Math.min(Math.max(numQuestions || 5, 1), 20);
        
        const prompt = `Based on the following text, generate a JSON array of ${count} ${difficulty} multiple-choice questions in ${language}. Each object in the array must have four properties: "question" (string), "options" (array of 4 strings), "correctAnswer" (string, which must be one of the options), and "explanation" (string).\n\nTEXT:\n${text}`;
        
        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        const textRes = responseBody.content[0].text.replace(/```json/g, '').replace(/```/g, '');
        res.json(JSON.parse(textRes));
    } catch (error: any) {
        res.status(500).json({ message: `Failed to generate MCQs: ${error.message}` });
    }
};

export const generatePersonalizedStudyGuide = async (req: Request, res: Response) => {
    const { llm, text, incorrectMCQs, language } = req.body;
    try {
        const incorrectReview = incorrectMCQs.map((mcq: any) =>
            `Question: ${mcq.question}\nCorrect Answer: ${mcq.correctAnswer}\nExplanation: ${mcq.explanation}`
        ).join('\n\n');
        const prompt = `A student took a quiz based on the provided text and got the following questions wrong. Create a personalized study guide in ${language} that focuses on these incorrect topics. Explain the concepts clearly and relate them back to the main text.\n\nORIGINAL TEXT:\n${text}\n\nINCORRECT QUESTIONS:\n${incorrectReview}`;
        
        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        res.json(responseBody.content[0].text);
    } catch (error: any) {
        res.status(500).json({ message: `Failed to generate study guide: ${error.message}` });
    }
};

export const fetchTopicInfo = async (req: Request, res: Response) => {
    const { llm, topic, language } = req.body;
    try {
        const prompt = `Generate comprehensive, well-structured study notes about "${topic}" in ${language}. The notes should be detailed enough for a university student to use for an exam. Use markdown for formatting.`;
        
        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        res.json(responseBody.content[0].text);
    } catch (error: any) {
        res.status(500).json({ message: `Failed to fetch topic info: ${error.message}` });
    }
};

export const transcribeAudio = async (req: Request, res: Response) => {
    const { llm } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const base64Data = file.buffer.toString('base64'); 
    const fileType = file.mimetype;

    try {
        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [
                    {
                        role: "user",
                        content: [{ text: "Transcribe the audio from this file. Respond only with the full transcription." }]
                    }
                ],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        res.json(responseBody.content[0].text);
    } catch (error: any) {
        res.status(500).json({ message: `Failed to transcribe audio: ${error.message}` });
    }
};

export const generateSummaryFromText = async (req: Request, res: Response) => {
    const { llm, text, language } = req.body;
    try {
        const prompt = `Summarize the following text in ${language}. Provide a concise but comprehensive overview of the key points.\n\nTEXT:\n${text}`;
        
        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        res.json(responseBody.content[0].text);
    } catch (error: any) {
        res.status(500).json({ message: `Failed to generate summary: ${error.message}` });
    }
};

export const generateFlashcardsFromText = async (req: Request, res: Response) => {
    const { llm, text, language } = req.body;
    try {
        const prompt = `Based on the following text, generate a JSON array of 5-10 flashcards in ${language}. Each flashcard should be an object with a "question" (string) and "answer" (string) property.\n\nTEXT:\n${text}`;
        
        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        const textRes = responseBody.content[0].text.replace(/```json/g, '').replace(/```/g, '');
        res.json(JSON.parse(textRes));
    } catch (error: any) {
        res.status(500).json({ message: `Failed to generate flashcards: ${error.message}` });
    }
};

export const generateAnswerFromText = async (req: Request, res: Response) => {
    const { llm, text, question, language } = req.body;
    try {
        const prompt = `Based on the context below, answer the user's question in ${language}.\n\nCONTEXT:\n${text}\n\nQUESTION:\n${question}`;
        
        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        res.json(responseBody.content[0].text);
    } catch (error: any) {
        res.status(500).json({ message: `Failed to generate answer: ${error.message}` });
    }
};

export const performSemanticSearch = async (req: Request, res: Response) => {
    const { text, query, topK, global, projectId } = req.body;

    if (!query) {
        return res.status(400).json({ message: "Query is required." });
    }

    try {
        let candidates: { content: string; vector: number[]; projectId?: string; projectName?: string }[] = [];

        if (global) {
            if (!req.user) return res.status(401).json({ message: "Unauthorized" });
            const projects = await StudyProject.find({ owner: req.user._id });

            for (const p of projects) {
                if (p.chunks && p.embeddings && p.chunks.length === p.embeddings.length) {
                    p.chunks.forEach((chunk, i) => {
                        candidates.push({
                            content: chunk,
                            vector: p.embeddings![i],
                            projectId: p._id.toString(),
                            projectName: p.name
                        });
                    });
                }
            }
        } else if (projectId) {
            const project = await StudyProject.findById(projectId);
            if (project && project.chunks && project.embeddings) {
                project.chunks.forEach((chunk, i) => {
                    candidates.push({ 
                        content: chunk, 
                        vector: project.embeddings![i],
                        projectId: project._id.toString(),
                        projectName: project.name
                    });
                });
            }
        }

        if (candidates.length === 0) {
            return res.json([]);
        }

        const results = candidates.slice(0, topK || 5).map(item => ({
            text: item.content,
            score: 0.8,
            projectName: item.projectName,
            projectId: item.projectId
        }));

        res.json(results);

    } catch (error: any) {
        console.error("Semantic Search Error:", error);
        res.status(500).json({ message: `Search failed: ${error.message}` });
    }
};

export const generateConceptMapFromText = async (req: Request, res: Response) => {
    const { llm, text, language } = req.body;
    try {
        const prompt = `Analyze the following text and generate a concept map. Identify the main concepts and their relationships. Return a JSON object with 'nodes' and 'links'. Each node should have an 'id' (the concept name) and a 'group' (a number for color-coding related concepts). Each link should have a 'source' (node id), a 'target' (node id), and a 'value' (representing the strength of the connection, from 1 to 10).\n\nTEXT:\n${text}`;

        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        const textRes = responseBody.content[0].text.replace(/```json/g, '').replace(/```/g, '');
        res.json(JSON.parse(textRes));
    } catch (error: any) {
        res.status(500).json({ message: `Failed to generate concept map: ${error.message}` });
    }
};

export const generateLessonPlanFromText = async (req: Request, res: Response) => {
    const { llm, text, topic, language } = req.body;
    try {
        const prompt = `Based on the following text content, create a detailed 50-minute lesson plan about "${topic}". The plan should be structured as a JSON object with keys: 'title', 'objective', 'duration' (string), 'materials' (array of strings), 'activities' (array of objects with 'name', 'duration', and 'description'), and 'assessment'.\n\nTEXT:\n${text}`;

        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        const textRes = responseBody.content[0].text.replace(/```json/g, '').replace(/```/g, '');
        res.json(JSON.parse(textRes));
    } catch (error: any) {
        res.status(500).json({ message: `Failed to generate lesson plan: ${error.message}` });
    }
};

export const generateStudyPlanFromText = async (req: Request, res: Response) => {
    const { llm, text, days, language } = req.body;
    try {
        const prompt = `Create a ${days}-day study plan based on the provided text. The output should be a JSON object with 'title', 'durationDays', and a 'schedule' array. Each item in the schedule should be an object with 'day' (number), 'topic' (string), and 'tasks' (array of strings).\n\nTEXT:\n${text}`;

        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        const textRes = responseBody.content[0].text.replace(/```json/g, '').replace(/```/g, '');
        res.json(JSON.parse(textRes));
    } catch (error: any) {
        res.status(500).json({ message: `Failed to generate study plan: ${error.message}` });
    }
};

export const getTutorResponseFromText = async (req: Request, res: Response) => {
    const { llm, text, message, history, language, persona } = req.body;
    try {
        const context = `CONTEXT: ${text.substring(0, 500000)}\n\n`;

        const messages = [
            ...(history || []).map((h: any) => ({
                role: h.role,
                content: [{ text: h.content }]
            })),
            {
                role: "user",
                content: [{ text: `${context}Based on the context above and our conversation history, answer my latest question in ${language}.\n\nLATEST QUESTION:\n${message}` }]
            }
        ];

        const systemInstruction = getPersonaInstruction(persona);

        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: messages,
                system: [{ text: systemInstruction + "\n\n" + MATH_INSTRUCTION }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        res.json(responseBody.content[0].text);
    } catch (error: any) {
        res.status(500).json({ message: `Tutor failed to respond: ${error.message}` });
    }
};

export const generateEssayOutlineFromText = async (req: Request, res: Response) => {
    const { llm, text, topic, language } = req.body;
    try {
        const prompt = `Create a detailed essay outline about "${topic}" based on the following text. Return a JSON object with 'title', 'introduction', 'body' (array of objects with 'heading' and 'points'), and 'conclusion'.\n\nTEXT:\n${text}`;
        
        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        const textRes = responseBody.content[0].text.replace(/```json/g, '').replace(/```/g, '');
        res.json(JSON.parse(textRes));
    } catch (error: any) {
        res.status(500).json({ message: `Failed to generate essay outline: ${error.message}` });
    }
};

export const generateEssayArgumentsFromText = async (req: Request, res: Response) => {
    const { llm, text, topic, language } = req.body;
    try {
        const prompt = `Based on the text provided, generate a list of strong arguments and potential counter-arguments for an essay on the topic: "${topic}". Format the output in clear Markdown.\n\nTEXT:\n${text}`;
        
        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        res.json(responseBody.content[0].text);
    } catch (error: any) {
        res.status(500).json({ message: `Failed to generate arguments: ${error.message}` });
    }
};

export const generateConceptMapForTopic = async (req: Request, res: Response) => {
    const { llm, topic, language } = req.body;
    try {
        const prompt = `Generate a concept map for the topic "${topic}". Return a JSON object with 'nodes' and 'links'. Nodes should have 'id' and 'group'. Links should have 'source', 'target', and 'value'.`;
        
        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        const textRes = responseBody.content[0].text.replace(/```json/g, '').replace(/```/g, '');
        res.json(JSON.parse(textRes));
    } catch (error: any) {
        res.status(500).json({ message: `Failed to generate concept map from topic: ${error.message}` });
    }
};

export const transcribeYoutubeVideo = async (req: Request, res: Response) => {
    const { url, llm } = req.body;
    
    if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
        return res.status(400).json({ message: "Invalid YouTube URL." });
    }

    console.log(`[YouTube] Processing: ${url}`);

    try {
        try {
            console.log("[YouTube] Attempting to fetch existing transcript...");
            const transcriptItems = await YoutubeTranscript.fetchTranscript(url);
            
            if (transcriptItems && transcriptItems.length > 0) {
                const fullText = transcriptItems.map(item => item.text).join(' ');
                console.log("[YouTube] Transcript fetched successfully!");
                return res.json(fullText);
            }
        } catch (transcriptError) {
            console.warn("[YouTube] Direct transcript fetch failed (video might not have captions). Falling back to audio download.");
        }

        console.log("[YouTube] Downloading audio stream...");
        const { buffer, mimeType } = await downloadAudioBuffer(url);
        
        const base64Data = buffer.toString('base64');
        
        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [
                    {
                        role: "user",
                        content: [{ text: "Transcribe the audio from this file. Respond only with the full transcription." }]
                    }
                ],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        console.log("[YouTube] Sending audio to Bedrock for transcription...");
        const responseBody = await invokeBedrockModel(params);
        res.json(responseBody.content[0].text);

    } catch (error: any) {
        console.error("YouTube Transcription Critical Failure:", error.message);
        
        if (error.message.includes('403') || error.message.includes('Sign in') || error.message.includes('bot')) {
             return res.status(503).json({ 
                message: "YouTube blocked the automated request (403 Forbidden). This video likely requires a login or your server IP is flagged. Please try a different video or use the 'Upload Audio' tab." 
            });
        }

        res.status(500).json({ message: `Failed to transcribe video: ${error.message}` });
    }
};

interface CodeAnalysisResult {
    algorithm: string;
    pseudocode: string;
    flowchart: string;
}

export const generateCodeAnalysis = async (req: Request, res: Response) => {
    const { llm, code, language } = req.body;

    if (!code || code.length < 10 || !/[{}();=]/.test(code)) {
        return res.status(400).json({
            message: "Input seems to be descriptive text, not code. Please provide a source code snippet."
        });
    }
    
    try {
        const prompt = `Analyze the following code and generate three artifacts: 1. A detailed Algorithm (step-by-step instructions). 2. Pseudocode (language-agnostic steps). 3. A text-based representation of a Flowchart (e.g., using Markdown or Mermaid syntax). Return a JSON object with three properties: "algorithm" (string), "pseudocode" (string), and "flowchart" (string). Ensure all outputs are in ${language}.\n\nCODE:\n${code}`;
        
        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        const textRes = responseBody.content[0].text.replace(/```json/g, '').replace(/```/g, '');
        const jsonResult: CodeAnalysisResult = JSON.parse(textRes);
        
        res.json(jsonResult);
    } catch (error: any) {
        console.error("Code Analysis Generation Error:", error);
        res.status(500).json({ message: `Failed to generate code analysis: ${error.message}` });
    }
};

export const explainCodeAnalysis = async (req: Request, res: Response) => {
    const { llm, artifact, language, explanationType } = req.body;
    try {
        const prompt = `Explain the following ${explanationType} in ${language} in a comprehensive and easy-to-understand manner. Focus on its purpose, how it works, and key concepts.\n\nCONTENT:\n${artifact}`;
        
        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        res.json(responseBody.content[0].text);
    } catch (error: any) {
        console.error("Code Analysis Explanation Error:", error);
        res.status(500).json({ message: `Failed to explain content: ${error.message}` });
    }
};

export const conductMockInterview = async (req: Request, res: Response) => {
    const { llm, topic, message, history, language, difficulty } = req.body;
    
    try {
        const systemInstruction = `You are a senior technical interviewer conducting a ${difficulty || 'Medium'} level interview on the topic: "${topic}". 
        
        Your Goal: Assess the candidate's knowledge, problem-solving skills, and depth of understanding.

        Guidelines:
        1. **Persona**: Professional, encouraging but rigorous. Do not act as a tutor who gives answers immediately.
        2. **Interaction**: Ask ONE question at a time. Wait for the candidate's response.
        3. **Evaluation**: After the candidate responds, briefly acknowledge if they are correct or partially correct. If they are wrong or stuck, provide a small hint, NOT the full answer.
        4. **Flow**: 
            - Start by introducing yourself and asking the first question related to ${topic}.
            - If the candidate answers correctly, ask a follow-up question or move to a slightly harder concept.
            - If the candidate struggles, guide them with the Socratic method.
        5. **Termination**: If the user says "End Interview" or "Stop", provide a comprehensive feedback summary of their performance, highlighting strengths and areas for improvement.

        ${MATH_INSTRUCTION}

        Respond in ${language}.`;

        const messages = [
            ...(history || []).map((h: any) => ({
                role: h.role,
                content: [{ text: h.content }]
            })),
            {
                role: "user",
                content: [{ text: message || "Hello, I am ready for the interview." }]
            }
        ];

        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: messages,
                system: [{ text: systemInstruction }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        res.json(responseBody.content[0].text);

    } catch (error: any) {
        console.error("Mock Interview Error Details:", JSON.stringify(error, null, 2));
        res.status(500).json({ message: `Mock Interview failed: ${error.message || 'Unknown error'}` });
    }
};

export const generatePodcastScript = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const { projectId, llm, language } = req.body;

    try {
        const project = await getProjectForUser(projectId, req.user.id);
        
        const systemInstruction = `You are an expert podcast producer. Your goal is to convert educational text into an engaging, 2-person podcast script.
        - **Host (Alex)**: The expert. Explains concepts clearly, uses analogies, and drives the conversation.
        - **Guest (Jamie)**: The curious learner. Asks clarifying questions, reacts with surprise/interest, and summarizes points to ensure understanding.
        - **Format**: Return ONLY a valid JSON array of objects. Each object must have "speaker" (either "Host" or "Guest") and "text" (the spoken line).
        - **Tone**: Conversational, lively, and educational. avoid "robot" speak.
        - **Language**: ${language || 'English'}.
        `;

        const prompt = `Convert the following study material into a podcast script:\n\n${project.ingestedText}`;

        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                system: [{ text: systemInstruction }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        const text = responseBody.content[0].text.replace(/```json/g, '').replace(/```/g, '');
        
        res.json(JSON.parse(text));
    } catch (error: any) {
        console.error("Podcast Generation Error:", error);
        res.status(500).json({ message: error.message || 'Failed to generate podcast script' });
    }
};

export const generateSlideContent = async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const { projectId, topic, llm, language } = req.body;

    try {
        const project = await getProjectForUser(projectId, req.user.id);
        
        const systemInstruction = `You are an expert presentation designer. Convert educational content into a structured slide deck.
        Return ONLY a valid raw JSON array. Do not use markdown formatting (no \`\`\`json blocks).
        
        Structure: Array<{ title: string, bullets: string[], speakerNotes: string }>
        
        Requirements:
        - Create 5-8 slides.
        - 'title': concise slide header.
        - 'bullets': 3-5 key points per slide (short sentences).
        - 'speakerNotes': A script for the presenter to say (2-3 sentences).
        - Language: ${language || 'English'}.
        ${MATH_INSTRUCTION}`;

        const prompt = `Create a slide deck based on this lesson plan topic: "${topic}".\n\nSOURCE CONTENT:\n${project.ingestedText.substring(0, 15000)}`; 

        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                system: [{ text: systemInstruction }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        let text = responseBody.content[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        res.json(JSON.parse(text));

    } catch (error: any) {
        console.error("Slide Gen Error:", error);
        res.status(500).json({ message: error.message || 'Failed to generate slides' });
    }
};

export const scrapeWebPage = async (req: Request, res: Response) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: "URL is required" });
    }

    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        $('script, style, noscript, iframe, img, svg, nav, footer, header, aside, .ads, .sidebar').remove();

        let content = '';
        const selectors = ['article', 'main', '.post-content', '.entry-content', '#content', '.content', '.article-body'];
        
        for (const selector of selectors) {
            const element = $(selector);
            if (element.length > 0) {
                content = element.text();
                break;
            }
        }

        if (!content) {
            content = $('body').text();
        }

        content = content.replace(/\s+/g, ' ').trim();

        if (!content || content.length < 50) {
             return res.status(400).json({ message: "Content too short or could not be extracted." });
        }

        const title = $('title').text().trim() || 'Scraped Article';

        res.json({ title, content });

    } catch (error: any) {
        console.error("Scraping Error:", error.message);
        res.status(500).json({ message: `Failed to scrape URL: ${error.message}` });
    }
};

export const transformText = async (req: Request, res: Response) => {
    const { llm, text, selection, instruction, language } = req.body;

    try {
        const prompt = `Act as an expert editor and study assistant.
        
        CONTEXT (Full Text):
        "${text.substring(0, 3000)}..."
        
        TARGET TEXT (Selection to modify, or cursor context):
        "${selection || 'Current cursor position (continue writing)'}"
        
        INSTRUCTION:
        ${instruction}
        
        OUTPUT REQUIREMENT:
        Return ONLY the new/modified text. Do not include conversational filler like "Here is the text". 
        If the instruction is to "continue", simply generate the next logical sentences.
        Respond in ${language || 'English'}.`;

        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        res.json(responseBody.content[0].text);

    } catch (error: any) {
        console.error("Transform Text Error:", error);
        res.status(500).json({ message: `Transformation failed: ${error.message}` });
    }
};

interface CodeTranslationResult {
    translatedCode: string;
    explanation: string;
}

export const translateCode = async (req: Request, res: Response) => {
    const { llm, code, targetLanguage } = req.body;

    if (!code || !targetLanguage) {
        return res.status(400).json({
            message: "Code and Target Language are required."
        });
    }

    try {
        const prompt = `Act as an expert software engineer. Translate the following code to ${targetLanguage}. 
        
        Requirements:
        1. Maintain the logic and functionality of the original code.
        2. Use idiomatic syntax for ${targetLanguage}.
        3. Explain 3 key syntax or structural differences between the original code and the translated version.

        Output Format:
        Return ONLY a JSON object with two properties:
        - "translatedCode" (string): The full converted code.
        - "explanation" (string): A concise explanation of the differences (Markdown supported).
        
        CODE TO TRANSLATE:
        ${code}`;

        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        const textRes = responseBody.content[0].text.replace(/```json/g, '').replace(/```/g, '');
        const jsonResult: CodeTranslationResult = JSON.parse(textRes);

        res.json(jsonResult);
    } catch (error: any) {
        console.error("Code Translation Error:", error);
        res.status(500).json({ message: `Failed to translate code: ${error.message}` });
    }
};

interface ResumeAnalysisResult {
    matchScore: number;
    missingKeywords: string[];
    tailoredSummary: string;
    suggestions: string[];
}

export const analyzeResume = async (req: Request, res: Response) => {
    const { llm, resumeText, jobDescription, language } = req.body;

    if (!resumeText || !jobDescription) {
        return res.status(400).json({ message: "Both Resume text and Job Description are required." });
    }

    try {
        const prompt = `Act as an expert ATS (Applicant Tracking System) and Career Coach. Compare the following Resume against the Job Description.
        
        Analyze for:
        1. **Match Score**: A percentage (0-100) representing how well the resume fits the job.
        2. **Missing Keywords**: Critical skills, tools, or terms found in the Job Description but missing from the Resume.
        3. **Tailored Summary**: Write a new, professional summary (3-4 sentences) for the resume that highlights relevant experience for THIS specific job.
        4. **Suggestions**: 3-5 concrete, actionable bullet points to improve the resume's impact.

        RESUME:
        ${resumeText.substring(0, 10000)}

        JOB DESCRIPTION:
        ${jobDescription.substring(0, 10000)}

        Output strictly as a JSON object with this structure:
        {
            "matchScore": number,
            "missingKeywords": ["string", "string"],
            "tailoredSummary": "string",
            "suggestions": ["string", "string"]
        }
        Respond in ${language || 'English'}.`;

        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        const textRes = responseBody.content[0].text.replace(/```json/g, '').replace(/```/g, '');
        const jsonResult: ResumeAnalysisResult = JSON.parse(textRes);

        res.json(jsonResult);

    } catch (error: any) {
        console.error("Resume Analysis Error:", error);
        res.status(500).json({ message: `Failed to analyze resume: ${error.message}` });
    }
};

export const analyzeProjectWeakness = async (req: Request, res: Response) => {
    const { projectId, llm, language } = req.body;

    try {
        const project = await getProjectForUser(projectId, req.user.id);

        const weakFlashcards = project.srsFlashcards?.filter(fc => fc.easeFactor < 2.3) || [];
        const recentIncorrectMcqs = project.mcqAttempts
            ?.slice(0, 5)
            .flatMap(attempt => attempt.incorrectQuestions) 
            || [];

        if (weakFlashcards.length === 0 && recentIncorrectMcqs.length === 0) {
            return res.json({
                weakTopics: [],
                focusTopic: "None",
                explanation: "Great job! We couldn't detect any significant patterns of failure. You are mastering this material.",
                actionableTips: ["Keep reviewing your flashcards to maintain retention.", "Try increasing the difficulty of your quizzes."]
            });
        }

        const failureContext = `
            The student is struggling with the following Flashcards (Ease Factor < 2.3):
            ${weakFlashcards.map(fc => `- Q: ${fc.question} | A: ${fc.answer}`).join('\n')}

            The student recently answered these Quiz Questions incorrectly:
            ${recentIncorrectMcqs.map(q => `- ${q}`).join('\n')}
        `;

        const prompt = `Act as an expert tutor analyzing a student's performance data.
        
        ${failureContext}

        Task:
        1. Identify clusters/themes in these failures (e.g., "Recursion", "Memory Management").
        2. Select the #1 most critical weak topic that needs immediate attention.
        3. Write a "Remedial Lesson" for this specific topic.

        Output strictly as JSON:
        {
            "weakTopics": [ {"topic": "string", "count": number (estimated items), "reason": "string (brief why)"} ],
            "focusTopic": "string (the #1 topic)",
            "explanation": "string (3-4 paragraphs explaining the concept simply, fixing common misconceptions found in the failures)",
            "actionableTips": ["string", "string", "string"]
        }
        Respond in ${language || 'English'}.`;

        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 2048,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        const text = responseBody.content[0].text.replace(/```json/g, '').replace(/```/g, '');
        
        res.json(JSON.parse(text));

    } catch (error: any) {
        console.error("Weakness Analysis Error:", error);
        res.status(500).json({ message: `Analysis failed: ${error.message}` });
    }
};

export const defineTerm = async (req: Request, res: Response) => {
    const { llm, term, context, language } = req.body;

    if (!term) return res.status(400).json({ message: "Term is required" });

    try {
        const prompt = `
        Define the term "${term}" as it is used in the following context:
        "${context?.substring(0, 200)}..."
        
        Requirements:
        1. Keep the definition simple (ELI5 style).
        2. Maximum 2 sentences.
        3. Respond in ${language || 'English'}.
        4. Return ONLY the definition text.
        `;

        const params: BedrockParams = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [{ role: "user", content: [{ text: prompt }] }],
                inferenceConfig: {
                    maxTokens: 512,
                    temperature: 0.7
                }
            })
        };

        const responseBody = await invokeBedrockModel(params);
        res.json({ definition: responseBody.content[0].text });

    } catch (error: any) {
        console.error("Define Term Error:", error);
        res.status(500).json({ message: `Definition failed: ${error.message}` });
    }
};