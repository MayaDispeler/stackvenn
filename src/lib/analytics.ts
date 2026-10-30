// One place for analytics events (TODO Phase 3 event list). PostHog is not installed yet, so
// track() sends nothing; once PostHog loads (window.posthog), every caller starts reporting.
type Props = Record<string, string | number | boolean>;

export function track(event: string, props: Props = {}): void {
  const ph = (window as { posthog?: { capture: (e: string, p: Props) => void } }).posthog;
  ph?.capture(event, props);
}
