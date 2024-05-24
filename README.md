# Arduin-O-Punch Web UI

This is a dev repo for Web UI. It'll help building `index.html` to be embedded into [arduin-o-punch](https://github.com/sakhnik/arduin-o-punch).

## Get started

Install the dependencies...

```bash
cd arduin-o-punch-web-ui
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run start:dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see the app running.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).

## Deploying to arduin-o-punch

TBD
