import React from 'react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

interface LandingPageProps {
    onGetStarted: () => void;
}

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const { addNotification } = useAppContext();
    
    // Smooth scroll handler
    const scrollToFeatures = (e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById('features');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Copy Email Handler
    const handleSupportClick = () => {
        const email = "kaironapp.ai@gmail.com";
        navigator.clipboard.writeText(email)
            .then(() => addNotification("Support email copied to clipboard!", "success"))
            .catch(() => addNotification("Failed to copy email.", "error"));
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-red-500/30 overflow-x-hidden">

            {/* Navbar */}
            <motion.nav 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between relative z-50"
            >
                <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M14.5 9L6 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M6 21L14.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M14.5 9L18 12L14.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-2xl font-bold tracking-wider text-slate-100">Kairon AI</span>
                </div>
                <div className="flex items-center gap-6">
                    <button onClick={onGetStarted} className="text-sm font-semibold text-slate-400 hover:text-white transition-colors hidden sm:block">
                        Log In
                    </button>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button onClick={onGetStarted} className="px-6 shadow-lg shadow-red-900/20">
                            Get Started
                        </Button>
                    </motion.div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <div className="relative pt-20 pb-32 sm:pt-32 sm:pb-40 overflow-hidden">
                {/* Animated Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                            x: [0, 20, 0]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl mix-blend-screen"
                    />
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [0.2, 0.4, 0.2],
                            y: [0, -30, 0]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl mix-blend-screen" 
                    />
                </div>

                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto px-6 text-center relative z-10"
                >
                    <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 text-red-400 text-xs font-medium mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        Now with Vision Support & Voice Mode
                    </motion.div>

                    <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
                        Master any subject <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">in minutes, not hours.</span>
                    </motion.h1>

                    <motion.p variants={fadeInUp} className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        The all-in-one AI learning platform. Upload your textbooks, notes, or lectures and let Kairon generate summaries, flashcards, and quizzes instantly.
                    </motion.p>

                    <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-4">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button onClick={onGetStarted} className="px-8 py-4 text-lg h-auto shadow-xl shadow-red-600/20">
                                Start Learning for Free
                            </Button>
                        </motion.div>
                        <motion.button 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }}
                            onClick={onGetStarted} 
                            className="px-8 py-4 text-lg font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 rounded-md transition-all"
                        >
                            View Demo
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Features Grid - Added ID for navigation */}
            <div id="features" className="bg-slate-900/50 border-y border-slate-800/50 relative">
                <div className="max-w-7xl mx-auto px-6 py-24">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold text-white mb-4">Everything you need to ace it</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Stop switching between ten different apps. Kairon AI unifies your entire study workflow into one powerful interface.</p>
                    </motion.div>

                    <motion.div 
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                            title="Multi-Modal Ingestion"
                            description="Upload PDFs, Word docs, Audio files, or even YouTube links. We extract the knowledge so you don't have to."
                        />
                        <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>}
                            title="Scientific Study Tools"
                            description="Automatically generate Spaced Repetition Flashcards and active recall Quizzes to hack your memory retention."
                        />
                        <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
                            title="Personal AI Tutor"
                            description="Stuck on a concept? Chat with your material. It's like having a professor available 24/7 to answer your specific questions."
                        />
                        <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>}
                            title="Visual Learning"
                            description="Turn dense text into beautiful Concept Maps and Flowcharts to visualize complex relationships instantly."
                        />
                        <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                            title="Vision Support"
                            description="Snap a photo of your handwritten notes or textbook diagrams. Kairon digests them just like digital text."
                        />
                        <FeatureCard
                            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            title="Gamified Progress"
                            description="Stay motivated with daily streaks, XP tracking, and leveling up. Building a study habit has never been this addictive."
                        />
                    </motion.div>
                </div>
            </div>

            <footer className="border-t border-slate-800 bg-slate-950 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-slate-200">Kairon AI</span>
                        <span className="text-slate-600">|</span>
                        <span className="text-sm text-slate-500">© {new Date().getFullYear()} Kairon Inc.</span>
                    </div>
                    <div className="flex gap-8 text-sm text-slate-400">
                        {/* Features Navigation */}
                        <a 
                            href="#features" 
                            onClick={scrollToFeatures}
                            className="hover:text-white transition-colors cursor-pointer"
                        >
                            Features
                        </a>
                        
                        {/* Support Email - Updated to Copy instead of mailto */}
                        <button 
                            onClick={handleSupportClick} 
                            className="hover:text-white transition-colors cursor-pointer"
                        >
                            Support
                        </button>

                        {/* GitHub / Open Source */}
                        <a 
                            href="https://github.com/sarim-aliii/version2" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:text-white transition-colors"
                        >
                            GitHub
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
    <motion.div 
        variants={fadeInUp}
        whileHover={{ y: -5 }}
        className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-red-500/30 transition-colors hover:bg-slate-800 group"
    >
        <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-200 mb-2">{title}</h3>
        <p className="text-slate-400 leading-relaxed">
            {description}
        </p>
    </motion.div>
);