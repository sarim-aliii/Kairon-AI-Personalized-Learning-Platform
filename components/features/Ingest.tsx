import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { FileUploader } from '../ui/FileUploader';
import { Slider } from '../ui/Slider';
import { fetchTopicInfo, extractTextFromFile, scrapeUrl } from '../../services/amazonService';
import { Loader } from '../ui/Loader';
import { Tab } from '../../types';
import { SmartEditor } from '../ui/SmartEditor';

export const Ingest: React.FC = () => {
  const { 
    ingestText, 
    addNotification, 
    language, 
    llm, 
    ingestedText, 
    activeProjectId, 
    updateActiveProjectData,
    setActiveTab 
  } = useAppContext();
  
  const [pastedText, setPastedText] = useState('');
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [chunkWords, setChunkWords] = useState(837);
  const [chunkOverlap, setChunkOverlap] = useState(254);
  const [topic, setTopic] = useState('');
  const [articleUrl, setArticleUrl] = useState('');

  const [isExtracting, setIsExtracting] = useState(false);

  // --- API HOOKS ---

  // 1. Auto-seed Hook
  const { execute: seedTopic, loading: isSeeding } = useApi(fetchTopicInfo, "Topic auto-seeded!");

  // 2. Scrape Hook
  const { execute: runScrape, loading: isScraping } = useApi(scrapeUrl, "Article scraped successfully!");

  // 3. Ingest/Save Hook
  const saveProjectLogic = useCallback(async (name: string, text: string) => {
        if (activeProjectId) {
            await updateActiveProjectData({ ingestedText: text });
            setActiveTab(Tab.Summary);
        } else {
            await ingestText(name, text);
        }
  }, [activeProjectId, updateActiveProjectData, ingestText, setActiveTab]);

  const { execute: saveProject, loading: isSaving } = useApi(saveProjectLogic, "Study material ingested successfully!");

  // Restore state from context
  useEffect(() => {
    if (ingestedText) {
      setPastedText(ingestedText);
      const regex = /--- START OF FILE: (.*?) ---/g;
      const matches = [...ingestedText.matchAll(regex)];
      if (matches.length > 0) {
        setFileNames(matches.map(m => m[1]));
      }
    } else {
      setPastedText('');
      setFileNames([]);
    }
  }, [ingestedText]);

  const acceptedMimeTypes = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    'application/vnd.ms-powerpoint': ['.ppt'],
    'text/plain': ['.txt'],
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/webp': ['.webp'],
    'image/heic': ['.heic'],
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };
  
  const handleFilesUpload = async (files: File[]) => {
    setFileNames(files.map(f => f.name));
    setPastedText('');
    setIsExtracting(true);

    const fileProcessingPromises = files.map(file => {
      return new Promise<string>(async (resolve, reject) => {
        try {
          let fileText = '';
          if (file.type === 'text/plain') {
            fileText = await new Promise<string>((res, rej) => {
              const reader = new FileReader();
              reader.onload = (e) => res(e.target?.result as string);
              reader.onerror = () => rej(new Error(`Failed to read ${file.name}.`));
              reader.readAsText(file);
            });
          }
          else if (
            file.type === 'application/pdf' ||
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
            file.type === 'application/vnd.ms-powerpoint' ||
            file.type.startsWith('image/')
          ) {
            const base64Data = await fileToBase64(file);
            fileText = await extractTextFromFile(llm, base64Data, file.type);
          }
          else {
            addNotification(`Skipping unsupported file type: ${file.name}.`, 'info');
            resolve('');
            return;
          }
          resolve(`\n\n--- START OF FILE: ${file.name} ---\n\n${fileText}\n\n--- END OF FILE: ${file.name} ---\n\n`);
        }
        catch (e: any) {
          reject(e);
        }
      });
    });

    try {
      const allTextContents = await Promise.all(fileProcessingPromises);
      setPastedText(allTextContents.join('').trim());
      addNotification(`Successfully processed ${files.length} file(s).`, 'success');
    }
    catch (e: any) {
      addNotification(e.message, 'error');
    }
    finally {
      setIsExtracting(false);
    }
  };

  const handleAutoSeed = async () => {
    if (!topic.trim()) {
      addNotification('Please enter a topic to auto-seed.', 'info');
      return;
    }
    const notes = await seedTopic(llm, topic, language);
    if (notes) {
      setPastedText(notes);
      setFileNames([`notes_on_${topic.replace(/\s+/g, '_')}.txt`]);
    }
  };

  const handleScrape = async () => {
    if (!articleUrl.trim()) {
      addNotification('Please enter a URL.', 'info');
      return;
    }

    const result = await runScrape(articleUrl);
    
    if (result) {
      setPastedText(result.content);
      setFileNames([result.title]);
    }
  };

  const handleIngest = async () => {
    if (!pastedText.trim()) {
      addNotification('Please upload a file, paste text, or scrape a URL first.', 'info');
      return;
    }

    let projectName = "Study Project";
    if (topic.trim()) {
      projectName = topic;
    } else if (fileNames.length > 0) {
      projectName = fileNames[0];
      if (fileNames.length > 1) projectName += ` + ${fileNames.length - 1} others`;
    } else {
      projectName = `Notes ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
    }

    await saveProject(projectName, pastedText);
  };

  return (
    <div className="space-y-8">
      {/* 1. File Upload */}
      <Card title="Ingest study material (PDF / DOCX / Images / TXT)">
        <FileUploader 
            onFileUpload={handleFilesUpload} 
            acceptedMimeTypes={acceptedMimeTypes} 
            multiple={true} 
            unsupportedFormatError="Supported formats: PDF, DOCX, PPT, TXT, PNG, JPG, WEBP."
            onError={addNotification}
        />
        {isExtracting && (
            <div className="flex items-center gap-2 text-slate-400 mt-2 text-sm p-2 bg-slate-900/50 rounded-md">
                <Loader spinnerClassName="w-5 h-5" />
                <span>Extracting text/content from {fileNames.length} file(s)...</span>
            </div>
        )}
        {fileNames.length > 0 && !isExtracting && (
            <div className="text-sm text-slate-400 mt-2">
                <p className="font-semibold">Loaded Content:</p>
                <ul className="list-disc list-inside pl-2">
                    {fileNames.map((name, index) => <li key={index}>{name}</li>)}
                </ul>
            </div>
        )}
      </Card>

      {/* 2. Web & Topic Import Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Import from Web">
              <div className="flex gap-2">
                  <input
                      type="url"
                      value={articleUrl}
                      onChange={(e) => setArticleUrl(e.target.value)}
                      placeholder="https://example.com/article"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                      disabled={isScraping}
                  />
                  <Button onClick={handleScrape} disabled={!articleUrl.trim() || isScraping}>
                      {isScraping ? '...' : 'Scrape'}
                  </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">Extracts main article text from news sites, docs, and blogs.</p>
          </Card>

          <Card title="Auto-Seed Topic">
              <div className="flex gap-2">
                  <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. Quantum Physics"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                      disabled={isSeeding}
                  />
                  <Button onClick={handleAutoSeed} disabled={!topic.trim() || isSeeding}>
                      {isSeeding ? '...' : 'Generate'}
                  </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">Uses AI to generate comprehensive notes on any subject.</p>
          </Card>
      </div>

      <div className="flex items-center space-x-4">
        <hr className="flex-grow border-slate-700" />
        <span className="text-slate-400 text-sm">Review & Edit</span>
        <hr className="flex-grow border-slate-700" />
      </div>

      {/* 3. Smart Editor & Actions */}
      <Card>
        {/* REPLACED TEXTAREA WITH SMART EDITOR */}
        <SmartEditor
          value={pastedText}
          onChange={setPastedText}
          placeholder="Paste notes, scrape a URL, or type '/' for AI superpowers (Expand, Fix Grammar, Summarize)..."
          className="w-full h-96 bg-slate-900 border border-slate-700 rounded-md p-4 text-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-none transition resize-y"
        />
        
        <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Slider label="Chunk words" min={200} max={1200} value={chunkWords} onChange={setChunkWords} />
                <Slider label="Chunk overlap" min={0} max={400} value={chunkOverlap} onChange={setChunkOverlap} />
            </div>
            <Button onClick={handleIngest} disabled={!pastedText.trim() || isExtracting || isSaving} className="w-full">
                {isExtracting ? 'Processing...' : isSaving ? 'Saving Project...' : (activeProjectId ? 'Update Project Content' : 'Ingest & Build Index')}
            </Button>
        </div>
      </Card>
    </div>
  );
};