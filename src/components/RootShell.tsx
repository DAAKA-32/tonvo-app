import { Inter } from "next/font/google";
import MetaPixel from "@/components/MetaPixel";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { inlineDetectScript } from "@/lib/performance/detect";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * The <html>/<body> shell shared by the two root layouts: (app) for the signed-in product
 * (language kept client side) and [locale] for the public pages (language in the URL).
 */
export default function RootShell({
  lang,
  dir = "ltr",
  marketing = false,
  head,
  children,
}: {
  /** Document language, also written to data-tonvo-lang (the anti-translation guard restores lang from it). */
  lang: string;
  dir?: "ltr" | "rtl";
  /** Public marketing pages are always dark: no saved in-app theme is applied. */
  marketing?: boolean;
  /** Extra <head> content, for example JSON-LD. */
  head?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <html lang={lang} dir={dir} data-tonvo-lang={lang} data-tonvo-scope={marketing ? "public" : "app"} translate="no" className={`${inter.variable} notranslate`} suppressHydrationWarning>
      <head>
        {head}
        <script dangerouslySetInnerHTML={{ __html: inlineDetectScript() }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              // Theme only applies to the in-app dashboard scope, never to public marketing pages.
              var p = window.location.pathname;
              var isMarketing = ${marketing ? 'true' : 'false'} || p === '/' || p.indexOf('/login') === 0 || p.indexOf('/about') === 0
                || p.indexOf('/blog') === 0 || p.indexOf('/pricing') === 0 || p.indexOf('/use-cases') === 0
                || p.indexOf('/features') === 0 || p.indexOf('/compare') === 0 || p.indexOf('/industries') === 0
                || p.indexOf('/guides') === 0 || p.indexOf('/terms') === 0 || p.indexOf('/privacy') === 0
                || p.indexOf('/cookies') === 0 || p.indexOf('/legal') === 0;
              var meta = document.querySelector('meta[name="theme-color"]');
              if (isMarketing) {
                document.documentElement.removeAttribute('data-theme');
              } else {
                var t = localStorage.getItem('tonvo-theme');
                if (t === 'light') {
                  document.documentElement.setAttribute('data-theme','light');
                  document.documentElement.style.colorScheme = 'light';
                  if (meta) meta.setAttribute('content', '#fafafa');
                }
              }
            }catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased notranslate" translate="no">
        <MetaPixel />
        <AnalyticsTracker />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                // Block Ctrl/Cmd + scroll wheel zoom
                document.addEventListener('wheel',function(e){
                  if(e.ctrlKey||e.metaKey){e.preventDefault();}
                },{passive:false});

                // Block Ctrl/Cmd + +/-/0 keyboard zoom
                document.addEventListener('keydown',function(e){
                  if((e.ctrlKey||e.metaKey)&&(e.key==='+'||e.key==='-'||e.key==='='||e.key==='0')){
                    e.preventDefault();
                  }
                });

                // Block double-tap zoom on mobile
                var lastTouchEnd=0;
                document.addEventListener('touchend',function(e){
                  var now=Date.now();
                  if(now-lastTouchEnd<=300){e.preventDefault();}
                  lastTouchEnd=now;
                },false);

                // Block pinch-to-zoom on mobile
                document.addEventListener('touchmove',function(e){
                  if(e.touches&&e.touches.length>1){e.preventDefault();}
                },{passive:false});

                // Block gesturestart/gesturechange (Safari iOS)
                document.addEventListener('gesturestart',function(e){e.preventDefault();});
                document.addEventListener('gesturechange',function(e){e.preventDefault();});
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                // Tonvo owns its language layer. Neutralize browser translation extensions
                // (Google Translate, Chrome auto-translate, Microsoft, DeepL, Safari) so
                // they can't mutate the DOM, retranslate AI conversations, or break
                // React hydration/layout.
                try {
                  var html = document.documentElement;
                  var body = document.body;
                  function reassert(el){
                    if(!el) return;
                    if(el.getAttribute('translate') !== 'no') el.setAttribute('translate','no');
                    if(!/(^|\\s)notranslate(\\s|$)/.test(el.className||'')){
                      el.className = ((el.className||'') + ' notranslate').trim();
                    }
                  }
                  reassert(html);
                  reassert(body);

                  // Strip widgets/banners injected by Google Translate and similar tools.
                  var INJECTED_SELECTORS = [
                    '.goog-te-banner-frame',
                    '.goog-te-menu-frame',
                    '#goog-gt-tt',
                    '.goog-tooltip',
                    '.goog-text-highlight',
                    '#google_translate_element',
                    'iframe.skiptranslate',
                    'iframe[src*="translate.google"]',
                    'iframe[src*="translate.googleapis"]'
                  ];
                  function cleanup(){
                    INJECTED_SELECTORS.forEach(function(sel){
                      document.querySelectorAll(sel).forEach(function(el){ try{ el.remove(); }catch(_){} });
                    });
                    // Google Translate pins the body with inline top offset — reset it.
                    if(body && body.style && body.style.top){ body.style.top = ''; }
                    if(html && html.classList && html.classList.contains('translated-ltr')){
                      html.classList.remove('translated-ltr');
                    }
                    if(html && html.classList && html.classList.contains('translated-rtl')){
                      html.classList.remove('translated-rtl');
                    }
                    // External extensions sometimes rewrite <html lang>. Restore from
                    // the Tonvo-controlled truth marker (data-tonvo-lang), defaulting to 'en'.
                    if(html){
                      var expected = html.getAttribute('data-tonvo-lang') || 'en';
                      if(html.getAttribute('lang') !== expected){
                        html.setAttribute('lang', expected);
                      }
                    }
                    reassert(html);
                    reassert(body);
                  }
                  cleanup();
                  var mo = new MutationObserver(function(mutations){
                    var hit = false;
                    for(var i=0;i<mutations.length;i++){
                      var m = mutations[i];
                      if(m.type === 'childList' && m.addedNodes && m.addedNodes.length){ hit = true; break; }
                      if(m.type === 'attributes' && (m.attributeName === 'class' || m.attributeName === 'style' || m.attributeName === 'lang')){ hit = true; break; }
                    }
                    if(hit) cleanup();
                  });
                  mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class','style','lang'] });
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                function removeVercelToolbar(){
                  var selectors = ['#vercel-live-feedback','[data-vercel-toolbar]','vercel-live-feedback'];
                  selectors.forEach(function(s){
                    document.querySelectorAll(s).forEach(function(el){ el.remove(); });
                  });
                  document.querySelectorAll('iframe').forEach(function(f){
                    if(f.src && (f.src.includes('vercel.live') || f.src.includes('vercel.com')))f.remove();
                  });
                }
                removeVercelToolbar();
                var observer = new MutationObserver(removeVercelToolbar);
                observer.observe(document.body, { childList: true, subtree: true });
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
