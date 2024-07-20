---
slug: /getting-started
title: Getting Started
navigationId: getting-started
---

# Getting Started

First, let's install the universal-core CLI by installing it globally.

```shell
npm install -g @universal-packages/core
```

Let's create our first universal-core application using the universal-packages CLI. Make sure you have a version of Node equal to or greater than `18` installed on your machine.

<js-only>

```shell
ucore new my-app
```

</js-only>

<ts-only>

```shell
ucore new my-app --typescript
```

</ts-only>

This will install the universal-core global CLI and create a new project in the `my-app` directory. Now, let's navigate to the project directory and start the example app.

```shell
cd my-app
```

Now we can start the example app using the following command:

```shell
npm start
```

You will be able to see some logs in the console, and the app will be running. The console will also show some real-time statistics about the app.

Let's take a look at what we are running by checking the example app file.

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

```ts:title=src/Example.app.ts
import { CoreApp } from "@universal-packages/core";

interface ExampleAppConfig {
  cores: number;
  ram: number;
}

interface ExampleAppArgs {
  p: number;
  port: number;
}

export default class ExampleApp extends CoreApp<ExampleAppConfig,ExampleAppArgs> {
  public static readonly appName = "example-app";
  public static readonly description = "This app exemplify how the life cycle of a core app goes";

  private timeout: NodeJS.Timeout;

  public async run(): Promise<void> {
    this.timeout = setTimeout((): void => {}, 999999999);
    core.logger.log({
      level: "INFO",
      title: "Example app has started",
      category: "APP",
      metadata: this.config,
    });
  }

  public async stop(): Promise<void> {
    clearTimeout(this.timeout);
  }
}
```

This is a simple example of a core app. It has a `run` method that will be called to start the app and a `stop` method that will be called when a stop request has been made. In the sample app, the `run` method will create a timeout that will never end, and the `stop` method will clear this timeout.

This tells us that apps are meant to be kept alive and running, and that there should be a way to stop them.

This is what makes universal-core so powerful. It allows you to create apps that can do anything while sharing the entire code base and modules. This way, you may have a web server that can access your configured DB and a web socket server that can access the same DB, classes, and configured resources, all within the same code base.
