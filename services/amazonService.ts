import axiosInstance from './api';
import * as apiHelpers from './api';
import {
    ChatMessage,
    EssayOutline,
    LessonPlan,
    StudyPlan,
    ConceptMapData,
    CodeAnalysisResult,
    PodcastSegment,
    CodeTranslationResult,
    ResumeAnalysisResult,
    RemedialContent,
} from '../types';

// ... (Keep existing exports from ./api) ...
export {
    fetchTopicInfo,
    transcribeAudio,
    generateSummary,
    generateFlashcards,
    generateAnswer,
    generateMCQs,
    generatePersonalizedStudyGuide,
    extractTextFromFile,
    transcribeYoutube,
} from './api';

import { SearchResult, SlideData } from './api';

// ... (Keep other functions like generateStudyPlan, generateLessonPlan...) ...

export const generateStudyPlan = async (llm: string, text: string, days: number, language: string): Promise<StudyPlan> => {
    try {
        return await apiHelpers.generateStudyPlanFromText(llm, text, days, language);
    } catch (error) {
        console.error("Error in generateStudyPlan:", error);
        throw error;
    }
};

export const generateLessonPlan = async (llm: string, text: string, topic: string, language: string): Promise<LessonPlan> => {
    try {
        return await apiHelpers.generateLessonPlanFromText(llm, text, topic, language);
    } catch (error) {
        console.error("Error in generateLessonPlan:", error);
        throw error;
    }
};

export const generateConceptMapData = async (llm: string, text: string, language: string): Promise<ConceptMapData> => {
    try {
        return await apiHelpers.generateConceptMapFromText(llm, text, language);
    } catch (error) {
        console.error("Error in generateConceptMapData:", error);
        throw error;
    }
};

export const generateConceptMapForTopic = async (llm: string, topic: string, language: string): Promise<ConceptMapData> => {
    try {
        return await apiHelpers.generateConceptMapForTopic(llm, topic, language);
    } catch (error) {
        console.error("Error in generateConceptMapForTopic:", error);
        throw error;
    }
};

// ALIAS for the Expand feature request
export const generateConceptMapFromTopic = generateConceptMapForTopic;

// --- UPDATED TUTOR RESPONSE ---
export const getTutorResponse = async (llm: string, text: string, history: ChatMessage[], message: string, language: string, persona: string): Promise<string> => {
    try {
        // Direct call to ensure persona is passed correctly
        const { data } = await axiosInstance.post('/amazon/tutor', { 
            llm, 
            projectId: text, // Assuming 'text' here is projectId for project-based chat context
            history, 
            message, 
            language,
            persona 
        });
        return data;
    } catch (error) {
        // Fallback or retry logic if needed, or check if it's text-based
        try {
             const { data } = await axiosInstance.post('/amazon/tutor-from-text', { 
                llm, 
                text, 
                history, 
                message, 
                language,
                persona 
            });
            return data;
        } catch(e) {
             console.error("Error in getTutorResponse:", error);
             throw error;
        }
    }
};

export const generateEssayOutline = async (llm: string, text: string, topic: string, language: string): Promise<EssayOutline | null> => {
    try {
        return await apiHelpers.generateEssayOutlineFromText(llm, text, topic, language);
    } catch (error) {
        console.error("Error in generateEssayOutline:", error);
        throw error;
    }
};

export const generateEssayArguments = async (llm: string, text: string, topic: string, language: string): Promise<string> => {
    try {
        return await apiHelpers.generateEssayArgumentsFromText(llm, text, topic, language);
    } catch (error) {
        console.error("Error in generateEssayArguments:", error);
        throw error;
    }
};

export const generateCodeAnalysis = async (llm: string, code: string, language: string): Promise<CodeAnalysisResult> => {
    try {
        const { data } = await axiosInstance.post('/amazon/code-analysis/generate', { llm, code, language });
        return data as CodeAnalysisResult;
    } catch (error) {
        console.error("Error in generateCodeAnalysis:", error);
        throw error;
    }
};

export const explainCodeAnalysis = async (llm: string, artifact: string, language: string, explanationType: string): Promise<string> => {
    try {
        const { data } = await axiosInstance.post('/amazon/code-analysis/explain', { llm, artifact, language, explanationType });
        return data;
    } catch (error) {
        console.error("Error in explainCodeAnalysis:", error);
        throw error;
    }
};

export const conductMockInterview = async (llm: string, topic: string, message: string, history: ChatMessage[], language: string, difficulty: string): Promise<string> => {
    try {
        return await apiHelpers.conductMockInterview(llm, topic, message, history, language, difficulty);
    } catch (error) {
        console.error("Error in conductMockInterview:", error);
        throw error;
    }
};

export const generatePodcastScript = async (llm: string, projectId: string, language: string): Promise<PodcastSegment[]> => {
    try {
        return await apiHelpers.generatePodcastScript(llm, projectId, language);
    } catch (error) {
        console.error("Error in generatePodcastScript:", error);
        throw error;
    }
};

export const performSemanticSearch = async (
    llm: string, 
    text: string, 
    query: string, 
    topK: number,
    projectId?: string,
    global: boolean = false
): Promise<SearchResult[]> => {
    try {
        return await apiHelpers.performSemanticSearch(llm, text, query, topK, projectId, global);
    } catch (error) {
        console.error("Error in performSemanticSearch:", error);
        throw error;
    }
};

export const generateSlides = async (llm: string, projectId: string, topic: string, language: string): Promise<SlideData[]> => {
    try {
        return await apiHelpers.generateSlideContent(llm, projectId, topic, language);
    } catch (error) {
        console.error("Error in generateSlides:", error);
        throw error;
    }
};

export const scrapeUrl = async (url: string): Promise<{ title: string, content: string }> => {
    try {
        return await apiHelpers.scrapeWebPage(url);
    } catch (error) {
        console.error("Error in scrapeUrl:", error);
        throw error;
    }
};

export const transformContent = async (llm: string, text: string, selection: string, instruction: string, language: string): Promise<string> => {
    try {
        return await apiHelpers.transformText(llm, text, selection, instruction, language);
    } catch (error) {
        console.error("Error in transformContent:", error);
        throw error;
    }
};

export const translateCode = async (llm: string, code: string, targetLanguage: string): Promise<CodeTranslationResult> => {
    try {
        const { data } = await axiosInstance.post('/amazon/code-analysis/translate', { 
            llm, 
            code, 
            targetLanguage 
        });
        return data as CodeTranslationResult;
    } catch (error) {
        console.error("Error in translateCode:", error);
        throw error;
    }
};

export const analyzeResume = async (llm: string, resumeText: string, jobDescription: string, language: string): Promise<ResumeAnalysisResult> => {
    try {
        const { data } = await axiosInstance.post('/amazon/analyze-resume', { 
            llm, 
            resumeText, 
            jobDescription, 
            language 
        });
        return data as ResumeAnalysisResult;
    } catch (error) {
        console.error("Error in analyzeResume:", error);
        throw error;
    }
};

export const analyzeWeakness = async (llm: string, projectId: string, language: string): Promise<RemedialContent> => {
    try {
        const { data } = await axiosInstance.post('/amazon/analyze-weakness', { 
            llm, 
            projectId, 
            language 
        });
        return data as RemedialContent;
    } catch (error) {
        console.error("Error in analyzeWeakness:", error);
        throw error;
    }
};

export const defineTerm = async (llm: string, term: string, context: string, language: string): Promise<string> => {
    try {
        return await apiHelpers.defineTerm(llm, term, context, language);
    } catch (error) {
        console.error("Error in defineTerm:", error);
        throw error;
    }
};