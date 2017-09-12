# Ready app

`ready-app` is a CLI for scaffolding web apps. It's basically a `git clone` of https://github.com/zgreen/webpack-boilerplate with a few bells and whistles.

## Caveats

This is a work-in-progress.

## Install

Install as a global...

```
npm install -g ready-app
```

or don't, and use `npx`

## Use

### Scaffold a vanilla JS app into `my-app`

```
ready-app --dir=my-app
```

### Scaffold a React app into `my-app`

```
ready-app react --dir=my-app
```

### Scaffold an Elm app into `my-app`

```
ready-app elm --dir=my-app
```

... you get the idea.
