import { useState, useEffect, useRef, useCallback } from 'react';


interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: { new(): ISpeechRecognition };
    webkitSpeechRecognition: { new(): ISpeechRecognition };
  }
}

const languageToCodeMap: { [key: string]: string } = {
    'Afrikaans': 'af-ZA',
    'Albanian': 'sq-AL',
    'Amharic': 'am-ET',
    'Arabic': 'ar-SA',
    'Armenian': 'hy-AM',
    'Assamese': 'as-IN',
    'Azerbaijani': 'az-AZ',
    'Basque': 'eu-ES',
    'Bengali': 'bn-IN',
    'Bosnian': 'bs-BA',
    'Bulgarian': 'bg-BG',
    'Burmese': 'my-MM',
    'Cantonese': 'yue-Hant-HK',
    'Catalan': 'ca-ES',
    'Chinese (Traditional)': 'zh-TW',
    'Croatian': 'hr-HR',
    'Czech': 'cs-CZ',
    'Danish': 'da-DK',
    'Dutch': 'nl-NL',
    'English': 'en-US',
    'Estonian': 'et-EE',
    'Filipino': 'fil-PH',
    'Finnish': 'fi-FI',
    'French': 'fr-FR',
    'Galician': 'gl-ES',
    'Georgian': 'ka-GE',
    'German': 'de-DE',
    'Greek': 'el-GR',
    'Gujarati': 'gu-IN',
    'Haitian Creole': 'ht-HT',
    'Hausa': 'ha-NG',
    'Hebrew': 'he-IL',
    'Hindi': 'hi-IN',
    'Hungarian': 'hu-HU',
    'Icelandic': 'is-IS',
    'Igbo': 'ig-NG',
    'Indonesian': 'id-ID',
    'Irish': 'ga-IE',
    'Italian': 'it-IT',
    'Japanese': 'ja-JP',
    'Javanese': 'jv-ID',
    'Kannada': 'kn-IN',
    'Kazakh': 'kk-KZ',
    'Khmer': 'km-KH',
    'Korean': 'ko-KR',
    'Kurdish': 'ku-TR',
    'Kyrgyz': 'ky-KG',
    'Lao': 'lo-LA',
    'Latvian': 'lv-LV',
    'Lithuanian': 'lt-LT',
    'Luxembourgish': 'lb-LU',
    'Macedonian': 'mk-MK',
    'Malagasy': 'mg-MG',
    'Malay': 'ms-MY',
    'Malayalam': 'ml-IN',
    'Maltese': 'mt-MT',
    'Mandarin Chinese': 'zh-CN',
    'Maori': 'mi-NZ',
    'Marathi': 'mr-IN',
    'Mongolian': 'mn-MN',
    'Nepali': 'ne-NP',
    'Norwegian': 'no-NO',
    'Odia': 'or-IN',
    'Pashto': 'ps-AF',
    'Persian': 'fa-IR',
    'Polish': 'pl-PL',
    'Portuguese': 'pt-BR',
    'Punjabi': 'pa-IN',
    'Romanian': 'ro-RO',
    'Russian': 'ru-RU',
    'Serbian': 'sr-RS',
    'Sinhala': 'si-LK',
    'Slovak': 'sk-SK',
    'Slovenian': 'sl-SI',
    'Somali': 'so-SO',
    'Spanish': 'es-ES',
    'Sundanese': 'su-ID',
    'Swahili': 'sw-KE',
    'Swedish': 'sv-SE',
    'Tajik': 'tg-TJ',
    'Tamil': 'ta-IN',
    'Telugu': 'te-IN',
    'Thai': 'th-TH',
    'Turkish': 'tr-TR',
    'Turkmen': 'tk-TM',
    'Ukrainian': 'uk-UA',
    'Urdu': 'ur-IN',
    'Uzbek': 'uz-UZ',
    'Vietnamese': 'vi-VN',
    'Welsh': 'cy-GB',
    'Xhosa': 'xh-ZA',
    'Yoruba': 'yo-NG',
    'Zulu': 'zu-ZA',
};

export const useSpeech = (languageName: string = 'English') => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<ISpeechRecognition | null>(null);
    const manualStop = useRef(false);

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const browserSupportsSpeech = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) && ('speechSynthesis' in window);

    const langCode = languageToCodeMap[languageName] || 'en-US';
    
    useEffect(() => {
        if (!browserSupportsSpeech) return;

        const keepAliveInterval = setInterval(() => {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
            } else {
                window.speechSynthesis.getVoices();
            }
        }, 10000);

        return () => {
            clearInterval(keepAliveInterval);
        };
    }, [browserSupportsSpeech]);

    useEffect(() => {
        if (!browserSupportsSpeech) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = langCode;

        recognition.onresult = (event) => {
            const fullTranscript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            setTranscript(fullTranscript);
        };

        recognition.onerror = (event) => {
            if (event.error !== 'aborted' && event.error !== 'no-speech') {
                const errorMessage = `Speech recognition error: ${event.error}. Please check microphone permissions.`;
                console.error(errorMessage);
                setError(errorMessage);
                manualStop.current = true;
            }
        };

        recognition.onend = () => {
            if (manualStop.current) {
                setIsListening(false);
            } else if (recognitionRef.current) {
                try {
                    recognitionRef.current.start();
                } catch (e) {
                    console.error("Could not restart speech recognition:", e);
                    setIsListening(false);
                }
            }
        };
        
        return () => {
            manualStop.current = true;
            recognitionRef.current?.stop();
            window.speechSynthesis.cancel();
        };

    }, [browserSupportsSpeech, langCode]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            setError(null); // Clear previous errors
            manualStop.current = false;
            setTranscript('');
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (err) {
                console.error('Error starting speech recognition:', err);
                setIsListening(false);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            manualStop.current = true;
            recognitionRef.current.stop();
        }
    }, [isListening]);

    const speak = useCallback((text: string) => {
        if (!text || !browserSupportsSpeech) return;
        
        setError(null); // Clear previous errors
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
        }
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;

        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
        };
        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
        };
        utterance.onpause = () => {
             setIsPaused(true);
        };
        utterance.onresume = () => {
            setIsPaused(false);
        };
        utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
            const errorMessage = `Speech synthesis error: ${event.error}. Your browser may not support this voice or language.`;
            console.error(errorMessage, event);
            setError(errorMessage);
            setIsSpeaking(false);
            setIsPaused(false);
        };

        window.speechSynthesis.speak(utterance);
    }, [browserSupportsSpeech, langCode]);

    const pauseSpeaking = useCallback(() => {
        if (browserSupportsSpeech && isSpeaking) {
            window.speechSynthesis.pause();
        }
    }, [browserSupportsSpeech, isSpeaking]);

    const resumeSpeaking = useCallback(() => {
        if (browserSupportsSpeech && isSpeaking) {
            window.speechSynthesis.resume();
        }
    }, [browserSupportsSpeech, isSpeaking]);

    const cancelSpeaking = useCallback(() => {
        if (browserSupportsSpeech) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setIsPaused(false);
        }
    }, [browserSupportsSpeech]);

    return {
        isListening,
        transcript,
        startListening,
        stopListening,
        isSpeaking,
        isPaused,
        speak,
        pauseSpeaking,
        resumeSpeaking,
        cancelSpeaking,
        browserSupportsSpeech,
        setTranscript,
        error,
    };
};