import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi';
import { defineTerm } from '../../services/amazonService';
import { Loader } from './Loader';

interface ContextualHoverProps {
    children: React.ReactNode;
    enabled?: boolean;
}

export const ContextualHover: React.FC<ContextualHoverProps> = ({ children, enabled = true }) => {
    const { llm, language } = useAppContext();
    const [selection, setSelection] = useState<Selection | null>(null);
    const [definition, setDefinition] = useState<string | null>(null);
    const [virtualElement, setVirtualElement] = useState<any>(null);
    const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
    
    // API Hook
    const { execute: getDefinition, loading } = useApi(defineTerm);

    const { styles, attributes } = usePopper(virtualElement, popperElement, {
        placement: 'top',
        modifiers: [{ name: 'offset', options: { offset: [0, 8] } }],
    });

    useEffect(() => {
        if (!enabled) return;

        const handleSelection = () => {
            const sel = window.getSelection();
            if (!sel || sel.isCollapsed || !sel.toString().trim()) {
                // Close tooltip if selection is cleared
                setDefinition(null);
                setVirtualElement(null);
                return;
            }

            const text = sel.toString().trim();
            // Only define short terms (1-3 words usually)
            if (text.split(' ').length > 4) return; 

            const range = sel.getRangeAt(0);
            
            // Generate Virtual Element for Popper
            setVirtualElement({
                getBoundingClientRect: () => range.getBoundingClientRect(),
                contextElement: range.commonAncestorContainer,
            });
            
            setSelection(sel);
            setDefinition(null); // Clear old definition while loading new one

            // Debounce or just call immediately on specific trigger? 
            // Let's use a manual trigger button or auto-trigger. 
            // For smoother UX, auto-triggering on short selections is nice, 
            // but fetching for *every* selection is aggressive.
            // Let's fetch immediately for now.
            
            fetchDefinition(text, range.startContainer.textContent || "");
        };

        const fetchDefinition = async (term: string, context: string) => {
            try {
                const def = await getDefinition(llm, term, context, language);
                setDefinition(def);
            } catch (e) {
                // fail silently
            }
        };

        document.addEventListener('mouseup', handleSelection);
        return () => document.removeEventListener('mouseup', handleSelection);
    }, [enabled, llm, language, getDefinition]);

    return (
        <>
            {children}
            
            {/* Tooltip Portal */}
            {virtualElement && (loading || definition) && createPortal(
                <div 
                    ref={setPopperElement} 
                    style={styles.popper} 
                    {...attributes.popper}
                    className="z-50 max-w-xs bg-slate-900 text-slate-200 text-sm p-3 rounded-lg shadow-xl border border-slate-700 animate-in fade-in zoom-in duration-200"
                >
                    {loading ? (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                             <Loader spinnerClassName="w-3 h-3" />
                             <span>Defining...</span>
                        </div>
                    ) : (
                        <div>
                            <div className="font-bold text-slate-100 mb-1 border-b border-slate-700 pb-1">
                                {selection?.toString()}
                            </div>
                            <p className="leading-relaxed">{definition}</p>
                        </div>
                    )}
                    <div className="absolute w-2 h-2 bg-slate-900 border-r border-b border-slate-700 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2" />
                </div>,
                document.body
            )}
        </>
    );
};