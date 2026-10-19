# Fieldnotes

A static, mobile-first editorial website made with semantic HTML, CSS, and vanilla JavaScript. It has no runtime library dependencies.

## Preview

The site is published with GitHub Pages at https://humanloophq.github.io/fieldnotes/. This repository is public, so its source files are visible to everyone.

## Content and newsletter

Stories and their article copy are centralized in `content.js`. To add an article route, add its slug folder under `journal/` with an `index.html` copied from an existing article route folder. The article body and metadata are rendered from the matching story object.

The newsletter validates email addresses in the browser but does not send them anywhere. Connect a provider to the `wireNewsletter` handler in `app.js` before collecting subscriptions; the current message explicitly says signups are not connected.

