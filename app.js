(() => {
  const { stories, topics, bySlug, formatDate } = window.FIELDNOTES;
  const main = document.querySelector('#main-content');
  const headerRoot = document.querySelector('#site-header');
  const footerRoot = document.querySelector('#site-footer');
  const basePath = location.pathname === '/fieldnotes' || location.pathname.startsWith('/fieldnotes/') ? '/fieldnotes' : '';
  const routePath = (value) => `${basePath}${value}`;
  const path = location.pathname.slice(basePath.length).replace(/\/+$/, '') || '/';
  const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const topicUrl = (topic) => `${routePath('/journal/')}?topic=${encodeURIComponent(topic)}`;
  const storyUrl = (story) => routePath(`/journal/${story.slug}/`);
  const setDescription = (text) => { let tag = document.querySelector('meta[name="description"]'); if (!tag) { tag = document.createElement('meta'); tag.name = 'description'; document.head.append(tag); } tag.content = text; };
  const setCanonical = () => { let tag = document.querySelector('link[rel="canonical"]'); if (!tag) { tag = document.createElement('link'); tag.rel = 'canonical'; document.head.append(tag); } tag.href = `${location.origin}${routePath(path === '/' ? '/' : `${path}/`)}`; };

  function header() {
    headerRoot.innerHTML = `<header class="masthead"><a class="wordmark" href="${routePath('/')}" aria-label="Fieldnotes home">FIELDNOTES<span>®</span></a><button class="menu-toggle" aria-expanded="false" aria-controls="main-nav">Menu</button><nav id="main-nav" class="nav" aria-label="Main navigation"><a href="${routePath('/journal/')}">Journal</a><a href="${routePath('/topics/')}">Topics</a><a href="${routePath('/about/')}">About</a><a class="nav-search" href="${routePath('/search/')}">Search <span aria-hidden="true">↗</span></a><a class="subscribe-link" href="${routePath('/')}#newsletter">Subscribe <span>↗</span></a></nav></header>`;
    const button = headerRoot.querySelector('.menu-toggle');
    const nav = headerRoot.querySelector('.nav');
    const close = () => { button.setAttribute('aria-expanded', 'false'); button.textContent = 'Menu'; nav.classList.remove('open'); };
    button.addEventListener('click', () => { const open = button.getAttribute('aria-expanded') !== 'true'; button.setAttribute('aria-expanded', String(open)); button.textContent = open ? 'Close' : 'Menu'; nav.classList.toggle('open', open); });
    nav.addEventListener('click', (event) => { if (event.target.closest('a')) close(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
  }

  function footer() {
    footerRoot.innerHTML = `<footer class="footer"><div class="footer-top"><div><a href="${routePath('/')}" class="wordmark">FIELDNOTES<span>®</span></a><p>A concept publication built around curious ideas.</p></div><nav class="footer-links" aria-label="Footer"><a href="${routePath('/journal/')}">Journal</a><a href="${routePath('/topics/')}">Topics</a><a href="${routePath('/about/')}">About</a><a href="mailto:hello@fieldnotes.example">Contact</a><a href="${routePath('/')}#newsletter">Newsletter</a><a href="${routePath('/feed.xml')}">RSS feed</a></nav><p class="footer-note">Made for the in-between moments.<br>Issue 01—08 · Independent since 2026</p></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Fieldnotes. An independent publication.</span><a href="${routePath('/search/')}">Find something ↗</a></div></footer>`;
  }

  function card(story, variant = 'standard') {
    return `<article class="story-card ${variant}"><a class="story-image" href="${storyUrl(story)}"><img src="${esc(story.coverImage)}" alt="${esc(story.coverImageAlt)}" loading="lazy" width="1200" height="800"><span class="image-index">FN—${esc(story.issue)}</span></a><div class="story-copy"><div class="story-meta"><a href="${topicUrl(story.topic)}">${esc(story.topic)}</a><span>${formatDate(story.publishedAt)}</span><span>${story.readingTime} min read</span></div><h3><a href="${storyUrl(story)}">${esc(story.title)}</a></h3><p>${esc(story.excerpt)}</p><a class="read-link" href="${storyUrl(story)}">Read the story <span>↗</span></a></div></article>`;
  }

  function newsletter() {
    return `<section class="newsletter" id="newsletter"><div><span class="eyebrow">A LETTER FROM FIELDNOTES</span><h2>A little more<br>to notice.</h2><p>Occasional notes on curious ideas, overlooked details, and things worth thinking about.</p></div><form class="newsletter-form"><label for="newsletter-email">Your email address</label><div class="form-row"><input id="newsletter-email" name="email" type="email" autocomplete="email" required placeholder="you@example.com"><button>Subscribe ↗</button></div><p class="form-message" aria-live="polite">A thoughtful note, every so often. Unsubscribe whenever.</p></form></section>`;
  }

  function wireNewsletter() {
    document.querySelectorAll('.newsletter-form').forEach((form) => form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const message = form.querySelector('.form-message');
      if (!input.reportValidity()) return;
      message.textContent = 'Signups are not connected yet. Please check back soon.';
      message.classList.add('error');
    }));
  }

  function topicIndex() {
    return `<div class="topic-index">${topics.map((topic, i) => `<a href="${topicUrl(topic)}"><span class="topic-no">0${i + 1}</span><span>${topic}</span><span class="topic-count">${String(stories.filter((story) => story.topic === topic).length).padStart(2, '0')} notes</span><span class="topic-arrow">↗</span></a>`).join('')}</div>`;
  }

  function home() {
    const hero = stories[0];
    document.title = 'Fieldnotes — A concept publication built around curious ideas';
    setDescription('An independent publication exploring design, culture, technology, everyday observations, and curious ideas.');
    main.innerHTML = `<section class="home-hero page-gutter"><div class="hero-topline"><span>FIELDNOTE NO. ${hero.issue}</span><span>AN INDEPENDENT JOURNAL OF CURIOSITY</span><span>VOL. 01 — 2026</span></div><div class="hero-grid"><div class="hero-copy"><span class="eyebrow">${hero.topic} / A NOTE ON ATTENTION</span><h1>${esc(hero.title)}</h1><p class="hero-dek">${esc(hero.excerpt)}</p><div class="hero-byline"><span>Words by ${esc(hero.author)}</span><span>${formatDate(hero.publishedAt)}</span><span>${hero.readingTime} min read</span></div><a class="circle-link" href="${storyUrl(hero)}"><span>Read<br>the story</span><b>↗</b></a></div><a href="${storyUrl(hero)}" class="hero-image"><img src="${routePath('/assets/fieldnotes-hero.jpeg')}" alt="A glowing light bulb bursting with blue, violet, and orange pigment and sparks against a dark background" width="2048" height="1365" fetchpriority="high"><span class="image-caption">A spark of curiosity · 01 / 08</span></a></div><div class="hero-bottom"><span>DESIGN · CULTURE · EVERYDAY LIFE</span><a href="${routePath('/journal/')}">ENTER THE JOURNAL ↓</a><span>SCROLL TO WANDER</span></div></section><section class="section page-gutter recent"><div class="section-heading"><div><span class="eyebrow">NOTES FROM THE PRESENT</span><h2>Recent observations<span class="accent">.</span></h2></div><a href="${routePath('/journal/')}" class="text-link">All stories ↗</a></div><div class="feature-row">${card(stories[1], 'wide')}${card(stories[2], 'compact')}</div><div class="story-pair">${card(stories[3])}${card(stories[4])}</div></section><section class="interlude page-gutter"><span class="eyebrow">A WORKING THOUGHT · 01</span><p>“Curiosity begins<br>where certainty ends.”</p><div><span>FIELDNOTES, ISSUE 001</span><span>KEEP LOOKING ↗</span></div></section><section class="section topics-section page-gutter"><div class="section-heading"><div><span class="eyebrow">A MAP, WITH ROOM TO WANDER</span><h2>Ideas worth following<span class="accent">.</span></h2></div><a href="${routePath('/topics/')}" class="text-link">Topic index ↗</a></div>${topicIndex()}</section><div class="page-gutter">${newsletter()}</div>`;
    wireNewsletter();
  }

  function intro(kicker, title, description) {
    return `<div class="page-intro"><span class="eyebrow">${kicker}</span><h1>${title}</h1><p>${description}</p></div>`;
  }

  function browserPage(searchOnly = false) {
    const params = new URLSearchParams(location.search);
    const selectedTopic = searchOnly ? '' : (params.get('topic') || '');
    const query = params.get('q') || '';
    const title = searchOnly ? 'Search Fieldnotes' : 'The Journal — Fieldnotes';
    document.title = title;
    setDescription(searchOnly ? 'Search Fieldnotes stories across design, culture, technology, and everyday life.' : 'Browse Fieldnotes stories on design, culture, technology, and everyday life.');
    main.innerHTML = `<section class="page-gutter listing-page">${searchOnly ? intro('THE INDEX / SEARCH', 'What are you<br><i>looking for?</i>', 'Search titles, subjects, authors, and the small details in between.') : intro('THE JOURNAL / ISSUE 001—008', 'Notes from<br>the <i>in-between.</i>', 'Small inquiries into the things we pass, keep, make, and wonder about.')}<div class="filter-bar"><div class="filter-topics"><button data-topic="" class="${selectedTopic ? '' : 'active'}">All notes <span>${stories.length}</span></button>${topics.map((topic) => `<button data-topic="${esc(topic)}" class="${selectedTopic === topic ? 'active' : ''}">${topic}</button>`).join('')}</div><div class="filter-tools"><label for="journal-search">Search</label><input id="journal-search" type="search" value="${esc(query)}" placeholder="A word, an idea…"><label for="journal-sort">Sort</label><select id="journal-sort"><option value="newest">Newest</option><option value="oldest">Oldest</option></select></div></div><p class="result-count" aria-live="polite"></p><div class="journal-grid"></div><div class="empty-state" hidden><span class="eyebrow">NO MATCHES, FOR NOW</span><h2>Try another path.</h2><p>Clear a filter or search for a different idea.</p><button class="clear-filters">Clear filters ↗</button></div>${searchOnly ? `<p class="search-reset" hidden><a href="${routePath('/search/')}">Clear search ×</a></p>` : ''}</section>`;
    const input = main.querySelector('#journal-search');
    const grid = main.querySelector('.journal-grid');
    const count = main.querySelector('.result-count');
    const empty = main.querySelector('.empty-state');
    const clear = main.querySelector('.search-reset');
    let topic = selectedTopic;
    let sort = 'newest';
    function refresh(updateUrl = true) {
      const term = input.value.trim().toLowerCase();
      const results = stories.filter((story) => (!topic || story.topic === topic) && (!term || `${story.title} ${story.excerpt} ${story.author} ${story.topic} ${story.tags.join(' ')} ${story.body.map((block) => block.text).join(' ')}`.toLowerCase().includes(term))).sort((a, b) => sort === 'oldest' ? a.publishedAt.localeCompare(b.publishedAt) : b.publishedAt.localeCompare(a.publishedAt));
      count.textContent = `${results.length} ${results.length === 1 ? 'story' : 'stories'}${topic ? ` in ${topic}` : ''}${term ? ` matching “${input.value.trim()}”` : ''}`;
      grid.innerHTML = results.map((story) => `<article class="journal-item"><a href="${storyUrl(story)}" class="journal-image"><img src="${esc(story.coverImage)}" alt="${esc(story.coverImageAlt)}" loading="lazy" width="1200" height="800"></a><div class="story-meta"><span>${esc(story.topic)}</span><span>${formatDate(story.publishedAt)}</span><span>${story.readingTime} min</span></div><h2><a href="${storyUrl(story)}">${esc(story.title)}</a></h2><p>${esc(story.excerpt)}</p></article>`).join('');
      empty.hidden = results.length > 0;
      if (clear) clear.hidden = !term;
      main.querySelectorAll('[data-topic]').forEach((button) => button.classList.toggle('active', button.dataset.topic === topic));
      if (updateUrl) { const next = new URL(location.href); topic ? next.searchParams.set('topic', topic) : next.searchParams.delete('topic'); term ? next.searchParams.set('q', input.value.trim()) : next.searchParams.delete('q'); history.replaceState({}, '', `${next.pathname}${next.search}`); }
    }
    main.querySelectorAll('[data-topic]').forEach((button) => button.addEventListener('click', () => { topic = button.dataset.topic; refresh(); }));
    input.addEventListener('input', () => refresh());
    main.querySelector('#journal-sort').addEventListener('change', (event) => { sort = event.target.value; refresh(false); });
    main.querySelector('.clear-filters').addEventListener('click', () => { topic = ''; input.value = ''; refresh(); input.focus(); });
    refresh(false);
  }

  function topicsPage() {
    document.title = 'Topics — Fieldnotes';
    setDescription('Follow an idea through the Fieldnotes topic index: design, culture, technology, objects, places, rituals, futures, and observations.');
    main.innerHTML = `<section class="page-gutter topics-page">${intro('A FIELD GUIDE TO OUR CURIOSITY', 'Choose a thread.<br><i>Follow it.</i>', 'Our subjects overlap, wander, and occasionally surprise us. Start anywhere.')}<div class="topic-directory">${topics.map((topic, i) => `<a href="${topicUrl(topic)}"><span class="topic-no">0${i + 1}</span><div><h2>${topic}</h2><p>${stories.some((story) => story.topic === topic) ? `${stories.filter((story) => story.topic === topic).length} notes to begin with` : 'A subject we are still collecting notes on.'}</p></div><span class="topic-arrow">↗</span></a>`).join('')}</div></section>`;
  }

  function aboutPage() {
    document.title = 'About Fieldnotes';
    setDescription('Fieldnotes is an independent publication built around curious ideas and the quiet art of noticing.');
    main.innerHTML = `<section class="page-gutter about-page">${intro('A NOTE ABOUT THIS PLACE', 'A publication for<br>the <i>curious.</i>', '')}<div class="about-body"><p class="about-lede">Fieldnotes is an independent digital publication exploring design, culture, technology, everyday observations, unusual ideas, and the connections between them.</p><p>We believe the world gets more interesting when we look a little longer. Our stories begin with objects, rituals, places, and questions that are easy to pass by. They are written with care, for readers who like their ideas clear and their edges a little open.</p><p>Fieldnotes is made slowly and independently. Each note is an invitation to follow a thought, notice something new, and return to the day with a slightly different view.</p><div class="about-signoff">— The Fieldnotes desk<br><span>Issue 01 · 2026</span></div></div><div class="page-gutter">${newsletter()}</div></section>`;
    wireNewsletter();
  }

  function articlePage(story) {
    const index = stories.indexOf(story);
    const previous = stories[(index + stories.length - 1) % stories.length];
    const next = stories[(index + 1) % stories.length];
    const related = stories.filter((item) => item.slug !== story.slug && item.topic === story.topic).slice(0, 2);
    const picks = related.length ? related : stories.filter((item) => item.slug !== story.slug).slice(0, 2);
    const url = `${location.origin}${routePath(`/journal/${story.slug}/`)}`;
    document.title = `${story.title} — Fieldnotes`;
    setDescription(story.excerpt);
    const schema = { '@context': 'https://schema.org', '@type': 'Article', headline: story.title, description: story.excerpt, datePublished: story.publishedAt, author: { '@type': 'Person', name: story.author }, image: story.coverImage, publisher: { '@type': 'Organization', name: 'Fieldnotes' } };
    main.innerHTML = `<div class="reading-progress" aria-hidden="true"></div><article class="article-page page-gutter"><div class="article-crumb"><a href="${routePath('/journal/')}">← Back to the journal</a><span>FIELDNOTE NO. ${story.issue}</span></div><header class="article-header"><div class="story-meta"><a href="${topicUrl(story.topic)}">${esc(story.topic)}</a><span>${formatDate(story.publishedAt)}</span><span>${story.readingTime} min read</span></div><h1>${esc(story.title)}</h1><p class="article-dek">${esc(story.excerpt)}</p><div class="article-byline"><span>Words by <b>${esc(story.author)}</b></span><span>Filed under <b>${esc(story.topic)}</b></span><div class="share-links"><a href="mailto:?subject=${encodeURIComponent(story.title)}&body=${encodeURIComponent(url)}">Email ↗</a><a target="_blank" rel="noreferrer" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}">Share ↗</a></div></div></header><figure class="article-cover"><img src="${esc(story.coverImage)}" alt="${esc(story.coverImageAlt)}" width="1600" height="1000" fetchpriority="high"><figcaption>FIELDNOTES / ISSUE ${story.issue} — ${esc(story.topic.toUpperCase())}</figcaption></figure><div class="article-layout"><aside class="article-side"><span>IN THIS NOTE</span><a href="#article-body">Read the essay ↓</a><span>${story.readingTime} MINUTES</span></aside><div class="article-body" id="article-body">${story.body.map((block) => block.type === 'heading' ? `<h2>${esc(block.text)}</h2>` : block.type === 'quote' ? `<blockquote>${esc(block.text)}</blockquote>` : `<p>${esc(block.text)}</p>`).join('')}<div class="article-end">✳ <span>END OF NOTE ${story.issue}</span></div></div></div><nav class="article-pagination" aria-label="Previous and next articles"><a href="${storyUrl(previous)}"><span>← PREVIOUS NOTE</span><b>${esc(previous.title)}</b></a><a href="${storyUrl(next)}"><span>NEXT NOTE →</span><b>${esc(next.title)}</b></a></nav><section class="related"><div class="section-heading"><div><span class="eyebrow">KEEP FOLLOWING THE THREAD</span><h2>Related notes<span class="accent">.</span></h2></div><a href="${routePath('/journal/') }" class="text-link">The full journal ↗</a></div><div class="story-pair">${picks.map((item) => card(item)).join('')}</div></section>${newsletter()}</article>`;
    const jsonLd = document.createElement('script'); jsonLd.type = 'application/ld+json'; jsonLd.textContent = JSON.stringify(schema); document.head.append(jsonLd);
    wireNewsletter();
    const progress = main.querySelector('.reading-progress');
    const updateProgress = () => { const max = document.documentElement.scrollHeight - innerHeight; progress.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`; };
    addEventListener('scroll', updateProgress, { passive: true }); updateProgress();
  }

  function notFound() {
    document.title = 'Page not found — Fieldnotes';
    setDescription('This page is elsewhere. Find another way into the Fieldnotes journal.');
    main.innerHTML = `<section class="page-gutter not-found"><span class="eyebrow">404 / A WRONG TURN</span><h1>This page is<br><i>somewhere else.</i></h1><p>There is always another way into the journal.</p><a class="text-link" href="${routePath('/journal/')}">Back to the journal ↗</a></section>`;
  }

  header(); footer(); setCanonical();
  if (path === '/') home();
  else if (path === '/journal') browserPage(false);
  else if (path === '/search') browserPage(true);
  else if (path === '/topics') topicsPage();
  else if (path === '/about') aboutPage();
  else if (path.startsWith('/journal/')) { const story = bySlug(path.split('/').pop()); story ? articlePage(story) : notFound(); }
  else notFound();
})();
