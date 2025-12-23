'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { hasUtmParams, saveUtmParams, type UtmData } from '@/lib/session-storage/utm';

const STANDARD_UTM_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

type ClientUtmCaptureProps = {
  customParams?: string[];
};

export function ClientUtmCapture({ customParams = [] }: ClientUtmCaptureProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only capture if not already stored (first visit only)
    if (!hasUtmParams()) {
      const allParamsToCapture = [...STANDARD_UTM_PARAMS, ...customParams];
      const utmData: UtmData = {};

      // Capture all relevant params
      allParamsToCapture.forEach((param) => {
        const value = searchParams.get(param);
        if (value) {
          utmData[param] = value;
        }
      });

      // Save to session storage
      saveUtmParams(utmData);
    }
  }, [searchParams, customParams]);

  return null;
}
