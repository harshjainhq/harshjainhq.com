# harshjainhq.com

The source for my personal website: [harshjainhq.com](https://harshjainhq.com).

Static HTML, CSS, and vanilla JavaScript. No framework, no build step.

## Structure

```text
index.html              Homepage
essays/                 Essays (one HTML file each)
essays/_template.html   Starting point for a new essay
privacy.html            Privacy policy
styles.css              Site styles
script.js               Theme toggle, table of contents, footnotes
favicon.svg             Tab icon
robots.txt, sitemap.xml Search-engine metadata
```

## Running locally

No tooling required. Serve the folder with any static server:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8000/>.

## Adding an essay

1. Copy `essays/_template.html` to `essays/your-slug.html`.
2. Fill in the title, subtitle, dates, and body.
3. Link it on the homepage and add a `<url>` to `sitemap.xml`.

The table of contents is generated automatically from the `<h2>` headings.

## License

Copyright © Harsh Jain. The site content is all rights reserved.
