// server/src/controllers/projectController.ts

import { Request, Response } from 'express';
import StudyProject from '../models/StudyProject';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// Initialize Bedrock
const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_BEDROCK_REGION || "us-east-1"
});

const defaultModelName = 'us.amazon.nova-2-lite-v1:0';

// Helper to chunk text
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

// Helper to generate embeddings
async function generateEmbeddings(text: string) {
    const chunks = chunkText(text);
    
    const embeddings: number[][] = [];
    
    // Process in batches to avoid rate limits
    for (const chunk of chunks) {
        // slight delay to be safe
        await new Promise(resolve => setTimeout(resolve, 50)); 
        
        const params = {
            modelId: "amazon.titan-embed-text-v2:0",
            body: JSON.stringify({ inputText: chunk })
        };
        
        const command = new InvokeModelCommand(params);
        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(response.body.transformToString());
        embeddings.push(responseBody.embedding);
    }
    
    return { chunks, embeddings };
}

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req: Request, res: Response) => {
  if (!req.user) {
     res.status(401).json({ message: 'Not authorized' });
     return;
  }

  try {
    const projects = await StudyProject.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req: Request, res: Response) => {
  if (!req.user) {
     res.status(401).json({ message: 'Not authorized' });
     return;
  }

  try {
    const project = await StudyProject.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    if (project.owner.toString() !== req.user.id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req: Request, res: Response) => {
  if (!req.user) {
     res.status(401).json({ message: 'Not authorized' });
     return;
  }

  const { name, ingestedText } = req.body;
  try {
    // 1. Generate Embeddings immediately on creation
    const { chunks, embeddings } = await generateEmbeddings(ingestedText);

    const newProject = new StudyProject({
      name,
      ingestedText,
      owner: req.user.id,
      chunks,      // Save chunks
      embeddings,  // Save vectors
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid project data or AI Error' });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req: Request, res: Response) => {
  if (!req.user) {
     res.status(401).json({ message: 'Not authorized' });
     return;
  }

  try {
    const project = await StudyProject.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    if (project.owner.toString() !== req.user.id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    
    const { 
        name, 
        ingestedText,
        summary, 
        srsFlashcards, 
        mcqAttempts, 
        currentMcqs,
        semanticSearchHistory, 
        aiTutorHistory, 
        lessonPlan, 
        studyPlan, 
        conceptMapData,
        codeSnippet,
        codeAnalysis,
        todos
    } = req.body;

    if (name) project.name = name;
    
    // If text changes, regenerate embeddings
    if (ingestedText && ingestedText !== project.ingestedText) {
        project.ingestedText = ingestedText;
        try {
            const { chunks, embeddings } = await generateEmbeddings(ingestedText);
            project.chunks = chunks;
            project.embeddings = embeddings;
        } catch (err) {
            console.error("Failed to update embeddings:", err);
            // Don't fail the whole request, just log it. 
            // In prod, you might want to mark this project as 'processing_failed'
        }
    }

    if (summary) project.summary = summary;
    if (srsFlashcards) project.srsFlashcards = srsFlashcards;
    if (mcqAttempts) project.mcqAttempts = mcqAttempts;
    if (currentMcqs) project.currentMcqs = currentMcqs;
    if (semanticSearchHistory) project.semanticSearchHistory = semanticSearchHistory;
    if (aiTutorHistory) project.aiTutorHistory = aiTutorHistory;
    if (lessonPlan) project.lessonPlan = lessonPlan;
    if (studyPlan) project.studyPlan = studyPlan;
    if (conceptMapData) project.conceptMapData = conceptMapData;
    if (codeSnippet) project.codeSnippet = codeSnippet;
    if (codeAnalysis) project.codeAnalysis = codeAnalysis;
    if (todos) project.todos = todos;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error("Update Project Error:", error);
    res.status(400).json({ message: 'Project update failed' });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req: Request, res: Response) => {
  if (!req.user) {
     res.status(401).json({ message: 'Not authorized' });
     return;
  }

  try {
    const project = await StudyProject.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    if (project.owner.toString() !== req.user.id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Get all due flashcards across projects
// @route   GET /api/projects/due-flashcards
// @access  Private
export const getDueFlashcards = async (req: Request, res: Response) => {
  if (!req.user) {
     res.status(401).json({ message: 'Not authorized' });
     return;
  }

  try {
    const now = new Date();
    // Find projects where user is owner AND has at least one card with dueDate <= now
    const projects = await StudyProject.find({
      owner: req.user.id,
      'srsFlashcards.dueDate': { $lte: now }
    }).select('_id name srsFlashcards');

    res.json(projects);
  } catch (error) {
    console.error("Error fetching due cards:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};