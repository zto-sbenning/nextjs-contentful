'use client';

import React, { useState, useEffect } from 'react';
import { Bug, Eye, EyeOff, X, ChevronUp, Copy, Check } from 'lucide-react';
import type { PageDebugInfo } from './types';

const DEBUG_OPEN_KEY = 'debugOverlayOpen';

interface DebugOverlayProps {
    /** Informations de la page à afficher */
    info: PageDebugInfo;
}

/**
 * DebugOverlay - Composant de debug pour visualiser les infos Contentful
 * 
 * Affiche un picto flottant en overlay qui, au clic, présente les informations
 * de la page Contentful en cours de visualisation.
 * 
 * @example
 * ```tsx
 * // Dans un Server Component (PageContent.tsx)
 * <DebugOverlay 
 *   info={{
 *     contentType: "topicLanding",
 *     entryId: "abc123",
 *     displayName: "Homepage",
 *     template: "landing-page",
 *     locale: "en-US",
 *     isPreview: false
 *   }} 
 * />
 * ```
 */
export default function DebugOverlay({ info }: DebugOverlayProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Restore open state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(DEBUG_OPEN_KEY);
        if (saved === 'true') {
            setIsOpen(true);
        }
    }, []);

    const toggleOpen = () => {
        setIsOpen(prev => {
            const newState = !prev;
            localStorage.setItem(DEBUG_OPEN_KEY, String(newState));
            return newState;
        });
    };

    const copyToClipboard = async (value: string, field: string) => {
        try {
            await navigator.clipboard.writeText(value);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const { contentType, entryId, displayName, template, locale, isPreview } = info;

    // Couleurs selon le mode preview (vert pour preview, gris pour normal)
    const badgeClasses = isPreview
        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25'
        : 'bg-neutral-800 hover:bg-neutral-700 text-white dark:bg-neutral-700 dark:hover:bg-neutral-600';

    const panelClasses = isPreview
        ? 'border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/80'
        : 'border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900';

    return (
        <div className="fixed left-4 bottom-4 z-50 font-mono text-xs">
            {/* Panel (when open) */}
            {isOpen && (
                <div 
                    className={`mb-2 min-w-72 max-w-md w-fit rounded-lg border shadow-xl ${panelClasses}`}
                >
                    {/* Header */}
                    <div className={`flex items-center justify-between rounded-t-lg px-3 py-2 ${
                        isPreview 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-neutral-800 text-white dark:bg-neutral-700'
                    }`}>
                        <div className="flex items-center gap-2">
                            <Bug className="size-4" />
                            <span className="font-semibold uppercase tracking-wide">Debug</span>
                            {isPreview && (
                                <span className="flex items-center gap-1 rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-bold">
                                    <Eye className="size-3" />
                                    PREVIEW
                                </span>
                            )}
                        </div>
                        <button
                            onClick={toggleOpen}
                            className="rounded p-1 transition-colors hover:bg-white/20"
                            title="Fermer"
                            type="button"
                        >
                            <X className="size-4" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-2 p-3">
                        <InfoRow 
                            label="Type" 
                            value={contentType} 
                            onCopy={() => copyToClipboard(contentType, 'type')}
                            copied={copiedField === 'type'}
                            isPreview={isPreview}
                        />
                        <InfoRow 
                            label="ID" 
                            value={entryId} 
                            onCopy={() => copyToClipboard(entryId, 'id')}
                            copied={copiedField === 'id'}
                            mono
                            isPreview={isPreview}
                        />
                        <InfoRow 
                            label="Name" 
                            value={displayName ?? '—'} 
                            onCopy={displayName ? () => copyToClipboard(displayName, 'name') : undefined}
                            copied={copiedField === 'name'}
                            isPreview={isPreview}
                        />
                        <InfoRow 
                            label="Template" 
                            value={template ?? '—'} 
                            onCopy={template ? () => copyToClipboard(template, 'template') : undefined}
                            copied={copiedField === 'template'}
                            isPreview={isPreview}
                        />
                        <InfoRow 
                            label="Locale" 
                            value={locale} 
                            onCopy={() => copyToClipboard(locale, 'locale')}
                            copied={copiedField === 'locale'}
                            isPreview={isPreview}
                        />
                        
                        {/* Preview Status */}
                        <div className={`flex items-center justify-between border-t pt-2 ${
                            isPreview
                                ? 'border-emerald-300 dark:border-emerald-700'
                                : 'border-neutral-200 dark:border-neutral-700'
                        }`}>
                            <span className={isPreview ? 'text-emerald-700 dark:text-emerald-300' : 'text-neutral-500 dark:text-neutral-400'}>Preview</span>
                            <span className={`flex items-center gap-1.5 font-medium ${
                                isPreview 
                                    ? 'text-emerald-700 dark:text-emerald-300' 
                                    : 'text-neutral-600 dark:text-neutral-400'
                            }`}>
                                {isPreview ? (
                                    <>
                                        <Eye className="size-3.5" />
                                        Active
                                    </>
                                ) : (
                                    <>
                                        <EyeOff className="size-3.5" />
                                        Off
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={toggleOpen}
                className={`flex items-center gap-2 rounded-full px-3 py-2 shadow-lg transition-all duration-200 ${badgeClasses}`}
                title={isOpen ? 'Fermer le debug' : 'Ouvrir le debug'}
                type="button"
            >
                {isOpen ? (
                    <ChevronUp className="size-4" />
                ) : (
                    <Bug className="size-4" />
                )}
                {isPreview && !isOpen && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase">
                        <Eye className="size-3" />
                        Preview
                    </span>
                )}
            </button>
        </div>
    );
}

/**
 * Row d'information dans le panel
 */
function InfoRow({ 
    label, 
    value, 
    onCopy, 
    copied,
    mono = false,
    isPreview = false
}: { 
    label: string; 
    value: string; 
    onCopy?: () => void;
    copied?: boolean;
    mono?: boolean;
    isPreview?: boolean;
}) {
    return (
        <div className="flex items-start justify-between gap-2">
            <span className={`shrink-0 ${
                isPreview 
                    ? 'text-emerald-700 dark:text-emerald-300' 
                    : 'text-neutral-500 dark:text-neutral-400'
            }`}>{label}</span>
            <div className="flex items-center gap-1">
                <span 
                    className={`truncate text-right ${
                        isPreview
                            ? 'text-emerald-900 dark:text-emerald-100'
                            : 'text-neutral-900 dark:text-neutral-100'
                    } ${mono ? 'font-mono text-[10px]' : ''}`}
                    title={value}
                >
                    {value}
                </span>
                {onCopy && (
                    <button
                        onClick={onCopy}
                        className={`shrink-0 rounded p-0.5 transition-colors ${
                            isPreview
                                ? 'text-emerald-600 hover:bg-emerald-200 hover:text-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-800 dark:hover:text-emerald-200'
                                : 'text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-300'
                        }`}
                        title="Copier"
                        type="button"
                    >
                        {copied ? (
                            <Check className="size-3 text-green-500" />
                        ) : (
                            <Copy className="size-3" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
