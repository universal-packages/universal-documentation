---
slug: /typescript
title: Typescript
navigationId: typescript
---

# Typescript

All universal packages are written in typescript, all packages are transpiled to javascript and the types are included in the package. This means that you can use typescript or Javascript in your universal core apps.

> This site guides offers code examples in typescript and javascript, take a look at the controls with the **TS** and **JS** labels.

To generate a typescript project you can use the `--typescript` flag when creating a new project.

```bash
ucore new my-app --typescript
```

This will install the universal core global cli and create a new project in the `my-app` directory. Now lets navigate to the project directory and start the example app.

```bash
cd my-app
```

Now we can start the example app using the following command:

```bash
npm start
```

You will be able to see some logs in the console and the app will be running, the console also will show some real time statistics about the app.

Lest take a look at what we are running, check the example app file.

```typescript:title=src/Example.app.ts
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

This is a simple example of a core app, it has a `run` method that will be called to start the app and a `stop` method that will be called when a stop request has been made. In the sample app the `run` method will create a timeout that will never end, and the `stop` method will clear this timeout.

This tell us that apps are meant to be kept alive and running, and that there should be a way to stop them.

This is what makes universal-core so powerful, it allows you to create apps that can do anything while sharing all the code base and modules, this way you may have a web server that can access your configured db and a web socket server that can access the same db, classes and configured resources, all within the same code base.
