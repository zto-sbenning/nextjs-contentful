import { Suspense } from 'react';
import { ClientUtmCapture } from './ClientUtmCapture';

type UtmCaptureProps = {
  /**
   * Additional custom parameters to capture beyond standard UTM params
   * (utm_source, utm_medium, utm_campaign, utm_term, utm_content)
   */
  customParams?: string[];
};

export function UtmCapture({ customParams }: UtmCaptureProps) {
  return (
    <Suspense fallback={null}>
      <ClientUtmCapture customParams={customParams} />
    </Suspense>
  );
}
