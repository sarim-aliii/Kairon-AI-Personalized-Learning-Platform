import { Request, Response } from 'express';
import axios from 'axios';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_BEDROCK_REGION || "us-east-1"
});

const defaultModelName = 'us.amazon.nova-2-lite-v1:0';

// Helper: Detect if a file is "code" based on extension
const isCodeFile = (path: string): boolean => {
    const ignoredExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.pdf', '.lock', '.ttf', '.woff', '.woff2', '.eot', '.mp4', '.mp3', '.wav', '.zip', '.tar', '.gz'];
    const ignoredDirs = ['node_modules', 'dist', 'build', '.git', '.idea', '.vscode', 'coverage', '__tests__'];
    
    if (ignoredDirs.some(dir => path.includes(`/${dir}/`) || path.startsWith(`${dir}/`))) return false;
    if (ignoredExtensions.some(ext => path.endsWith(ext))) return false;
    
    return true;
};

// @desc    Analyze a GitHub Repository
// @route   POST /api/github/scan
// @access  Private
export const analyzeRepo = async (req: Request, res: Response) => {
    const { repoUrl, llm, language } = req.body;

    if (!repoUrl) return res.status(400).json({ message: "GitHub Repository URL is required." });

    try {
        // 1. Parse URL (e.g., https://github.com/owner/repo)
        const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
        const match = repoUrl.match(regex);
        if (!match) return res.status(400).json({ message: "Invalid GitHub URL." });

        const owner = match[1];
        const repo = match[2].replace('.git', '');

        console.log(`[RepoScan] Fetching tree for ${owner}/${repo}...`);

        // 2. Fetch File Tree (Recursive)
        const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`;
        let treeResponse;
        
        try {
            treeResponse = await axios.get(treeUrl);
        } catch (e) {
            // Fallback to 'master' if 'main' fails
            try {
                treeResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`);
            } catch (err: any) {
                return res.status(404).json({ message: "Repository not found or branch is not main/master." });
            }
        }

        const tree = treeResponse.data.tree;

        // 3. Filter for Code Files (Limit to top 60 files to prevent timeout/overload)
        const codeFiles = tree
            .filter((item: any) => item.type === 'blob' && isCodeFile(item.path))
            .slice(0, 60);

        console.log(`[RepoScan] Identified ${codeFiles.length} relevant files. Downloading content...`);

        // 4. Download Content (Parallel with concurrency limit)
        const fileContents: string[] = [];
        const batchSize = 10;
        
        for (let i = 0; i < codeFiles.length; i += batchSize) {
            const batch = codeFiles.slice(i, i + batchSize);
            const promises = batch.map(async (file: any) => {
                try {
                    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${treeResponse.data.sha || 'master'}/${file.path}`;
                    const { data } = await axios.get(rawUrl, { responseType: 'text' });
                    return `\n\n--- FILE: ${file.path} ---\n${typeof data === 'string' ? data : JSON.stringify(data)}`;
                } catch (e) {
                    console.warn(`Failed to fetch ${file.path}`);
                    return null;
                }
            });
            
            const results = await Promise.all(promises);
            fileContents.push(...results.filter(r => r !== null) as string[]);
        }

        const fullCodebase = fileContents.join('\n');
        console.log(`[RepoScan] Total context size: ${fullCodebase.length} chars.`);

        // 5. Send to Bedrock
        const prompt = `
        You are a Senior Software Architect. I am providing you with the file structure and contents of a GitHub repository.
        
        YOUR TASK:
        1. **Architecture Diagram**: Generate a **Mermaid.js** graph (flowchart TD or classDiagram) showing the high-level architecture, module dependencies, and data flow.
        2. **Explanation**: Explain how the application works, key technologies used, and the logic flow.
        
        OUTPUT FORMAT:
        Return a JSON object with two keys:
        - "diagram": The raw Mermaid code string.
        - "explanation": A Markdown string with the detailed explanation.

        CODEBASE CONTEXT:
        ${fullCodebase.substring(0, 3500000)} 
        `;

        const params = {
            modelId: llm || defaultModelName,
            body: JSON.stringify({
                messages: [
                    { 
                        role: "user", 
                        content: [{ text: prompt }]
                    }
                ],
                inferenceConfig: {
                    maxTokens: 4096,
                    temperature: 0.7
                }
            })
        };

        const command = new InvokeModelCommand(params);
        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(response.body.transformToString());
        
        // Nova format: extract from response["output"]["message"]["content"]
        let textRes: string;
        if (responseBody.output?.message?.content) {
            const contentList = responseBody.output.message.content;
            const textBlock = contentList.find((item: any) => item.text);
            textRes = textBlock?.text || '';
        } else {
            textRes = responseBody.content[0]?.text || '';
        }
        
        const jsonRes = JSON.parse(textRes);

        res.json(jsonRes);

    } catch (error: any) {
        console.error("Repo Scan Error:", error);
        res.status(500).json({ message: `Analysis failed: ${error.message}` });
    }
};