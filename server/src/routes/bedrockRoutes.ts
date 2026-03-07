import express from 'express';
import { 
    generateSummary,
    generateFlashcards,
    getTutorResponse,
    generateConceptMap,
    generateLessonPlan,
    generateStudyPlan,
    extractTextFromFile,
    generateMCQs,
    generatePersonalizedStudyGuide,
    fetchTopicInfo,                  
    transcribeAudio,                 
    generateSummaryFromText,        
    generateFlashcardsFromText,       
    generateAnswerFromText,          
    performSemanticSearch,
    generateConceptMapFromText,
    generateLessonPlanFromText,
    generateStudyPlanFromText,
    getTutorResponseFromText,
    generateEssayOutlineFromText,
    generateEssayArgumentsFromText,
    generateConceptMapForTopic,
    transcribeYoutubeVideo,
    generateCodeAnalysis,
    explainCodeAnalysis,
    conductMockInterview,
    generatePodcastScript,
    generateSlideContent,
    scrapeWebPage,
    transformText,
    translateCode,
    analyzeResume,
    analyzeProjectWeakness,
    defineTerm
} from '../controllers/bedrockController';
import { protect } from '../middleware/authMiddleware';
import multer from 'multer';


const router = express.Router();
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 200 * 1024 * 1024 }
});


router.post('/summary', protect, generateSummary);
router.post('/flashcards', protect, generateFlashcards);
router.post('/tutor', protect, getTutorResponse);
router.post('/concept-map', protect, generateConceptMap);
router.post('/lesson-plan', protect, generateLessonPlan);
router.post('/study-plan', protect, generateStudyPlan);
router.post('/topic-info', protect, fetchTopicInfo);
router.post('/summary-from-text', protect, generateSummaryFromText);
router.post('/flashcards-from-text', protect, generateFlashcardsFromText);
router.post('/answer-from-text', protect, generateAnswerFromText);
router.post('/semantic-search', protect, performSemanticSearch);
router.post('/generate-mcqs', protect, generateMCQs);
router.post('/generate-study-guide', protect, generatePersonalizedStudyGuide);
router.post('/extract-text', protect, extractTextFromFile);
router.post('/transcribe', protect, upload.single('file'), transcribeAudio);

router.post('/concept-map-from-text', protect, generateConceptMapFromText);
router.post('/lesson-plan-from-text', protect, generateLessonPlanFromText);
router.post('/study-plan-from-text', protect, generateStudyPlanFromText);
router.post('/tutor-from-text', protect, getTutorResponseFromText);
router.post('/essay-outline-from-text', protect, generateEssayOutlineFromText);
router.post('/essay-arguments-from-text', protect, generateEssayArgumentsFromText);
router.post('/concept-map-from-topic', protect, generateConceptMapForTopic);
router.post('/transcribe-youtube', protect, transcribeYoutubeVideo);

router.post('/code-analysis/generate', protect, generateCodeAnalysis);
router.post('/code-analysis/explain', protect, explainCodeAnalysis);
router.post('/code-analysis/translate', protect, translateCode);

router.post('/mock-interview', protect, conductMockInterview);
router.post('/podcast-script', protect, generatePodcastScript);
router.post('/slides', protect, generateSlideContent);
router.post('/scrape-url', protect, scrapeWebPage);
router.post('/transform', protect, transformText);
router.post('/analyze-resume', protect, analyzeResume);
router.post('/analyze-weakness', protect, analyzeProjectWeakness);
router.post('/define', protect, defineTerm);

export default router;