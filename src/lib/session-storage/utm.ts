const UTM_STORAGE_KEY = 'utm_params';

export type UtmData = Record<string, string>;

/**
 * Save UTM parameters to session storage
 */
export function saveUtmParams(data: UtmData): void {
  if (typeof window === 'undefined') return;
  
  if (Object.keys(data).length > 0) {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(data));
  }
}

/**
 * Get UTM parameters from session storage
 */
export function getUtmParams(): UtmData {
  if (typeof window === 'undefined') return {};
  
  const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
  if (!stored) return {};
  
  try {
    return JSON.parse(stored) as UtmData;
  } catch {
    return {};
  }
}

/**
 * Check if UTM parameters are already stored
 */
export function hasUtmParams(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(UTM_STORAGE_KEY) !== null;
}

/**
 * Clear stored UTM parameters
 */
export function clearUtmParams(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(UTM_STORAGE_KEY);
}
