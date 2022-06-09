# What is it?

It is an experimental/research project about how far can you push front-end performance. I have seen waty too many websites that were content-heavy either in media, or in JS "fireworks", that were absolutely rubbish on the performance front. Think Lighthouse scores below 20.
Here, we are trying to create a simple-ish website, that has some heavy, ThreeJS 3d effects going on in the background.
The thesis is, that despite that, we can still achieve decent performance scores - we are aiming for score >= 95 on mobile.
This is a work in progress.

## What it is not?

This is not an example of production-ready code. Though I may decide to put it online at some point as I like it visually a bit better then my existing site.

## Running

### Locally

Requires node@^12.18.0, yarn and a static server package, ie. `serve`
After checking out go:

```bash
yarn install
yarn build
serve -s -l 8080 build
```

Open `http://localhost:8080/` in chrome and run the Lighthouse tests.

### Online

Site is deployed to netlify, visit via following URL: `https://vigilant-dijkstra-c9599f.netlify.app/`.
