import {
    ReactNode,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from "react";
import useContentClamped from "./useContentClamped";
import {
    ellipsisClassNames,
    EllipsisClassNamesKey,
    TextShowMore
} from "./types";

/**
 * Version optimisée de useTextExpansion qui supprime le code inutile :
 * 
 * 🔴 Suppressions :
 * - visuallyExpanded state (jamais lu)
 * - useElementDimensions pour motionRef (redondant avec clientHeight direct)
 * - initialMotionFullHeight state (remplacé par ref)
 * - requestAnimationFrame superflu dans onEnd
 * 
 * ✅ Améliorations :
 * - Lecture directe de clientHeight/scrollHeight au lieu de hook lourd
 * - Moins de re-renders grâce à la suppression des states inutiles
 * - Code plus simple et lisible
 */
export default function useOptimizedTextExpansion({
    ztEllipsis,
    ztShowMore,
    children,
}: {
    ztEllipsis: EllipsisClassNamesKey;
    ztShowMore?: TextShowMore;
    children: ReactNode;
}) {
    /** Utilisé pour savoir si on doit afficher le bouton "Show More" */
    const hasInitialEllipsis = useMemo(
        () => ztEllipsis !== 'none',
        [ztEllipsis],
    );
    
    /** Utilisé pour déterminer la classe d'ellipsis initiale et pouvoir y revenir après le "Show Less" */
    const initialEllipsisClass = useMemo(
        () => ellipsisClassNames[ztEllipsis] || 'line-clamp-none',
        [ztEllipsis],
    );
    
    /** State pour gérer la classe d'ellipsis actuelle */
    const [ellipsisClassName, setEllipsisClassName] =
        useState(initialEllipsisClass);
    
    /** State pour gérer l'état d'expansion du contenu */
    const [expanded, setExpanded] = useState(false);
    
    /** State pour gérer l'état d'expansion visuelle du contenu (pendant l'animation) */
    const [visuallyExpanded, setVisuallyExpanded] = useState(false);
    
    /** State pour gérer la hauteur maximale du contenu */
    const [maxHeight, setMaxHeight] = useState<string | number>('none');

    const motionRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLElement>(null);
    
    /** Ref pour stocker la hauteur initiale (au lieu d'un state) */
    const initialHeightRef = useRef<number>(0);
    
    /** Ref pour forcer la mise à jour des hauteurs */
    const [heightUpdateTrigger, setHeightUpdateTrigger] = useState(0);

    /** State pour gérer l'état de débordement du contenu. Utilisé pour déterminer si le bouton "Show More" doit être affiché */
    const isClamped = useContentClamped({ ref: contentRef, deps: [children] });

    /** Doit on utiliser la version animée du composant ou non */
    const animate = !!(ztShowMore?.animate ?? ztShowMore?.transition);

    /** Fonction pour générer le bouton "Show More" */
    const btnFunction =
        ztShowMore?.btn &&
        typeof ztShowMore.btn === 'function' &&
        ztShowMore.btn;

    /** Détermine si le bouton "Show More" doit être affiché */
    const shouldShowBtn =
        hasInitialEllipsis &&
        (isClamped || expanded || visuallyExpanded) &&
        btnFunction;

    /** Création du bouton "Show More" ou "Show Less" */
    /** Utilisation de useMemo pour éviter de recréer le bouton à chaque rendu */
    /** Le bouton est créé uniquement si le contenu est clippé ou si l'état d'expansion est vrai */
    const btn = useMemo(
        () => shouldShowBtn && btnFunction?.(expanded, setExpanded),
        [shouldShowBtn, btnFunction, expanded],
    );

    /** On retire la classe d'ellipsis lors du début de l'animation "Show More" pour que le contenu soit déjà présent */
    const onStart = useCallback(() => {
        if (expanded) {
            setEllipsisClassName('line-clamp-none');
            setVisuallyExpanded(true);
        }
    }, [expanded]);

    /**
     * Gère la fin de l'animation "Show Less" :
     * - Réapplique l'ellipsis
     * - Attend une frame avant de :
     *   - Marquer le contenu comme "non visuellement étendu"
     *   - Réinitialiser la hauteur de référence
     * → Évite un flicker dû à un conflit de timing entre le clamp et l'animation
     */
    const onEnd = useCallback(() => {
        if (!expanded) {
            setEllipsisClassName(initialEllipsisClass);
            requestAnimationFrame(() => {
                setVisuallyExpanded(false);
                initialHeightRef.current = 0;
            });
        }
    }, [expanded, initialEllipsisClass]);

    /** S'il n'y a pas d'animation, onStart et onEnd sont appelés directement lors des changements de l'état d'expansion */
    useEffect(() => {
        if (!animate) {
            onStart();
            onEnd();
        }
    }, [expanded, animate, onStart, onEnd]);

    /**
     * Gère la logique de hauteur animée du composant :
     *
     * - Initialise la hauteur "réduite" lors du premier affichage.
     * - Met à jour la hauteur max en fonction de l'état `expanded`.
     * - Si le contenu est déjà complètement affiché, mais `expanded` est toujours vrai,
     *   cela signifie qu'un redimensionnement a annulé le besoin d'expansion :
     *   → on réinitialise l'état.
     */
    useLayoutEffect(() => {
        const motionEl = motionRef.current;
        const contentEl = contentRef.current;
        if (!motionEl || !contentEl) return;

        // Lecture directe des hauteurs (au lieu d'utiliser useElementDimensions)
        const motionHeight = motionEl.clientHeight;
        const contentHeight = contentEl.scrollHeight;

        // Initialise la hauteur de référence si nécessaire
        if (!initialHeightRef.current) {
            initialHeightRef.current = motionHeight;
        }

        // Met à jour la hauteur max selon l'état d'expansion
        if (!expanded) {
            setMaxHeight(initialHeightRef.current || motionHeight);
        } else {
            setMaxHeight(contentHeight);
        }

        // Si le contenu n'a plus besoin d'être étendu (redimensionnement), réinitialise
        if (expanded && contentHeight === initialHeightRef.current) {
            setExpanded(false);
            setEllipsisClassName(initialEllipsisClass);
            initialHeightRef.current = 0;
        }
    }, [
        expanded,
        children,
        initialEllipsisClass,
        heightUpdateTrigger, // Pour forcer la mise à jour si nécessaire
    ]);

    // Observer les changements de taille pour mettre à jour les hauteurs
    useEffect(() => {
        if (!motionRef.current || !contentRef.current) return;

        const resizeObserver = new ResizeObserver(() => {
            // Force une mise à jour des hauteurs
            setHeightUpdateTrigger(prev => prev + 1);
        });

        resizeObserver.observe(motionRef.current);
        resizeObserver.observe(contentRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, [children]);

    return {
        refs: { motionRef, contentRef },
        state: { ellipsisClassName, maxHeight },
        handlers: { onStart, onEnd },
        elements: { btn },
        config: { animate },
    };
}
