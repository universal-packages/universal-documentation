---
slug: "/getting-started"
title: "Getting Started"
navigationId: 1
---

# Getting Started

Lets create our first universal core application using the universal packages cli. Make sure you have a version of node equal or greater than `18` installed in your machine.

```bash
npx @universal-packages/core init my-app
```

This will install the universal core global cli and create a new project in the `my-app` directory. Now lets navigate to the project directory and start the example app.

```bash
cd my-app
```

Now we can start the example app using the following command:

```bash
npm start
```

No you will be able to see some logs in the console and the app will be running, the console also will show some real time statistics about the app.

Lest take a look at what we are running, check the example app file.

```js:title=src/Example.app.js
import { CoreApp } from "@universal-packages/core";

export default class ExampleApp extends CoreApp {
  static appName = "example-app";
  static description = "This app exemplify how the life cycle of a core app goes";

  timeout = 0;

  async run() {
    this.timeout = setTimeout(() => {}, 999999999);
  }


  async stop() {
    clearTimeout(this.timeout);
  }
}
```

This is a simple example of a core app, it has a `run` method that will be called when the app starts and a `stop` method that will be called when a stop request has been made. The `run` method will create a timeout that will never end, and the `stop` method will clear this timeout.

This tell us that apps are meant to be kept alive and running, and that there should be a way to stop them.

This is what makes universal-core so powerful, it allows you to create apps that can do anything while sharing all the code base and modules, this way you may have a web server that can access your configured db and a web socket server that can access the same db, classes and configured resources, all within the same code base.
