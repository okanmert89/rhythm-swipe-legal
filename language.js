(() => {
  const here = new URL(location.href);
  const preferred = here.searchParams.get('lang') || (navigator.languages?.[0] || navigator.language || 'en');
  const language = preferred.toLowerCase().split('-')[0] === 'tr' ? 'tr' : 'en';
  const file = here.pathname.split('/').pop() || 'index.html';
  const base = file.replace(/(?:\.tr)?\.html$/, '');
  if (!['privacy', 'terms', 'index'].includes(base)) return;
  if (document.documentElement.lang !== language) {
    const destination = new URL(base + (language === 'tr' ? '.tr' : '') + '.html', here);
    destination.search = here.search;
    destination.searchParams.set('lang', language);
    location.replace(destination.href);
    return;
  }
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', language === 'tr' ? 'Dil' : 'Language');
  nav.style.cssText = 'display:flex;gap:18px;flex-wrap:wrap;margin-bottom:24px';
  for (const [code, label] of [['tr', 'Türkçe'], ['en', 'English']]) {
    const link = document.createElement('a');
    link.href = base + (code === 'tr' ? '.tr' : '') + '.html?lang=' + code;
    link.textContent = label;
    link.lang = code;
    if (code === language) link.setAttribute('aria-current', 'page');
    nav.append(link);
  }
  (document.querySelector('main') || document.body).prepend(nav);
  for (const link of document.querySelectorAll('a[href]')) {
    if (link.closest('nav')) continue;
    const target = new URL(link.href, here);
    const match = target.pathname.match(/\/(privacy|terms|index)(?:\.tr)?\.html$/);
    if (target.origin !== here.origin || !match) continue;
    target.pathname = target.pathname.replace(/[^/]+$/, match[1] + (language === 'tr' ? '.tr' : '') + '.html');
    target.searchParams.set('lang', language);
    link.href = target.href;
  }
})();
