/** Cloudflare Turnstile on a page: the script loaded once, a widget rendered on demand. */

interface TurnstileApi {
  render(element: HTMLElement, options: Record<string, unknown>): string;
  reset(widget?: string): void;
  remove(widget: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let loading: Promise<TurnstileApi> | null = null;

function load(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile')));
    script.onerror = () => {
      loading = null;
      reject(new Error('turnstile'));
    };
    document.head.appendChild(script);
  });
  return loading;
}

/** How a page wants its widget: the colours (`auto` follows the system, not the site's own
 *  switch) and whether an expired answer is fetched again by itself. */
export interface WidgetLook {
  theme?: 'auto' | 'light' | 'dark';
  refreshExpired?: 'auto' | 'never';
}

/** Renders a widget into `element`; `onToken` gets each answer, `onExpired` when it lapses.
 *  `interaction-only`: the widget stays out of sight and appears only when Cloudflare needs the
 *  visitor to click it, so the try page does not open on a checkbox (2026-10-12). */
export async function widget(element: HTMLElement, siteKey: string, language: string, onToken: (token: string) => void, onExpired: () => void, look: WidgetLook = {}): Promise<{ reset(): void; remove(): void }> {
  const api = await load();
  const id = api.render(element, {
    sitekey: siteKey,
    language,
    theme: look.theme ?? 'auto',
    appearance: 'interaction-only',
    'refresh-expired': look.refreshExpired ?? 'auto',
    callback: onToken,
    'expired-callback': onExpired,
    'error-callback': onExpired,
  });
  return { reset: () => api.reset(id), remove: () => api.remove(id) };
}
