
/**
 * Inline Cache interfaces and structures
 */

export const IC_STATE = {
    UNINITIALIZED: 0,
    MONOMORPHIC: 1,
    POLYMORPHIC: 2,
    MEGAMORPHIC: 3
};

export interface InlineCache {
    state: number;
    hits: number;
    misses: number;
    property: string | number;
    
    // Monomorphic cache
    shape?: any; // The shape/class/constructor of the object
    offset?: number | string; // The resolved lookup key or index
    
    // Polymorphic cache (array of shapes -> offsets)
    shapes?: any[];
    offsets?: any[];
}

export class ICMetrics {
    static hits = 0;
    static misses = 0;
    static invalidations = 0;
}

