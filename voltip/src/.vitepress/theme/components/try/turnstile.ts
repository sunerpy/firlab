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

/** Renders a widget into `element`; `onToken` gets each answer, `onExpired` when it lapses. */
export async function widget(element: HTMLElement, siteKey: string, language: string, onToken: (token: string) => void, onExpired: () => void): Promise<{ reset(): void; remove(): void }> {
  const api = await load();
  const id = api.render(element, {
    sitekey: siteKey,
    language,
    theme: 'auto',
    callback: onToken,
    'expired-callback': onExpired,
    'error-callback': onExpired,
  });
  return { reset: () => api.reset(id), remove: () => api.remove(id) };
}
