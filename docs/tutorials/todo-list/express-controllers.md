---
slug: /tutorials/todo-list/express-controllers
title: Express Controllers
navigationId: todo-list-express-controllers
---

# Express Controllers

Its time to create our actual API endpoints, to create, mark as complete and delete our todo items. We will create a new controller to handle these actions.

## Core Express Controllers

First, we need to install the universal-core-express-controllers package:

```bash
npm install @universal-packages/core-express-controllers
```

Lets initialize the universal-core-express-controllers package by running the following command:

<js-only>

```bash
ucore initialize express-controllers
```

</js-only>

<ts-only>

```bash
ucore initialize express-controllers --typescript
```

</ts-only>

Now we have the common express controllers directory structure in our project as well as our config file at `.src/config/express-controllers-app.yaml`.

In the previous chapter when we initialized TypeORM we got the config file `typeorm-module.yaml`, the `module` suffix is doe to the fact that `core-typeorm` provides as `CoreModule` that can be used across the applications, but in the case of `core-express-controllers` it provides a `CoreApp` that runs a http server and make out controller's endpoints available. Thats why its configuration files reflects this difference in purpose.

## Configuring CORS

Lets configure CORS in our `express-controllers-app.yaml` file:

```yaml:title=src/config/express-controllers-app.yaml
cors: true
```

You can also configure the allowed origins, methods and headers:

```yaml:title=src/config/express-controllers-app.yaml
cors:
  origin: "*"
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  headers: "Origin, X-Requested-With, Content-Type, Accept"
```

and install the `cors` package:

```bash
npm install cors
```

This is necessary to allow our frontend to make requests to our backend since they are running on different ports and that counts as a cross-origin request.

## TodoItems Controller

<js-only>

Lets create our first controller for our TodoItems. Create a new file in the `src/controllers` directory called `TodoItems.controller.js`, the `.controller` suffix is a convention universal-core-express-controllers uses to identify controllers.

</js-only>

<ts-only>

Lets create our first controller for our TodoItems. Create a new file in the `src/controllers` directory called `TodoItems.controller.ts`, the `.controller` suffix is a convention universal-core-express-controllers uses to identify controllers.

</ts-only>

This is how our `TodoItemsController` should look like:

```js:title=src/controllers/TodoItems.controller.js
import {
  BaseController,
  Controller,
  Get,
} from "@universal-packages/express-controllers";
import { TodoItem } from "../entity/TodoItem";

@Controller("/todo-items")
export default class TodoItemsController extends BaseController {
  @Get()
  async index() {
    const todoItems = await TodoItem.find();

    return this.status("OK").json({ todoItems });
  }
}
```

We have created a new controller that will handle the `GET` request to the `/todo-items` endpoint. This controller will return all the todo items in the database. We can test this is working by visiting `http://localhost:3000/todo-items` in our browser.

If you created some todo items in the previous chapter, you should see them in the response.

```json
{
  "todoListItems": [
    {
      "id": "1",
      "content": "Buy milk",
      "done": false,
      "createdAt": "2024-07-17T02:03:41.658Z",
      "updatedAt": "2024-07-17T02:03:41.658Z"
    }
  ]
}
```

## Create Todo Item

Lets add a new method to our `TodoItemsController` to create a new todo item:

```js
  @Post({ bodyParser: "json" })
  async create() {
    const todoItem = new TodoItem();
    todoItem.content = this.request.body.content;
    todoItem.done = false;
    await todoItem.save();

    return this.status("CREATED").json({ todoItem });
  }
```

Here we are using the `@Post` decorator to handle the `POST` request to the `/todo-items` endpoint. We are expecting the request body to have a `content` property, which we will use to create the new todo item.

## Update Todo Item

Lets add a new method to our `TodoItemsController` to update a todo item:

```js
  @Put("/:id", { bodyParser: "json" })
  async update() {
    try {
      const todoItem = await TodoItem.findOneOrFail({
        where: { id: this.request.params.id },
      });
      if (this.request.body.content)
        todoItem.content = this.request.body.content;
      if (this.request.body.done) todoItem.done = this.request.body.done;
      await todoItem.save();

      return this.status("OK").json({ todoItem });
    } catch (error) {
      return this.status("NOT_FOUND");
    }
  }
```

Here we are using the `@Put` decorator to handle the `PUT` request to the `/todo-items/:id` endpoint. We are expecting the request body to have a `content` and/or `done` property, which we will use to update the todo item.

## Delete Todo Item

Lets add a new method to our `TodoItemsController` to delete a todo item:

```js
  @Delete("/:id")
  async delete() {
    try {
      const todoItem = await TodoItem.findOneOrFail({
        where: { id: this.request.params.id },
      });
      await todoItem.remove();

      return this.status("NO_CONTENT");
    } catch (error) {
      return this.status("NOT_FOUND");
    }
  }
```

Here we are using the `@Delete` decorator to handle the `DELETE` request to the `/todo-items/:id` endpoint. We are expecting the request to have a `id` parameter, which we will use to delete the todo item.

## Final controller

This is how our `TodoItemsController` should look like:

```js:title=src/controllers/TodoItems.controller.js
import {
  BaseController,
  Controller,
  Get,
  Post,
  Put,
  Delete,
} from "@universal-packages/express-controllers";
import { TodoItem } from "../entity/TodoItem";

@Controller("/todo-items")
export default class TodoItemsController extends BaseController {
  @Get()
  async index() {
    const todoItems = await TodoItem.find();

    return this.status("OK").json({ todoItems });
  }

  @Post({ bodyParser: "json" })
  async create() {
    const todoItem = new TodoItem();
    todoItem.content = this.request.body.content;
    todoItem.done = false;
    await todoItem.save();

    return this.status("CREATED").json({ todoItem });
  }

  @Put("/:id", { bodyParser: "json" })
  async update() {
    try {
      const todoItem = await TodoItem.findOneOrFail({
        where: { id: this.request.params.id },
      });
      if (this.request.body.content)
        todoItem.content = this.request.body.content;
      if (this.request.body.done !== undefined) todoItem.done = this.request.body.done;
      await todoItem.save();

      return this.status("OK").json({ todoItem });
    } catch (error) {
      return this.status("NOT_FOUND");
    }
  }

  @Delete("/:id")
  async delete() {
    try {
      const todoItem = await TodoItem.findOneOrFail({
        where: { id: this.request.params.id },
      });
      await todoItem.remove();

      return this.status("NO_CONTENT");
    } catch (error) {
      return this.status("NOT_FOUND");
    }
  }
}
```

## App watcher

For development universal-core will watch for file changes and reload the application. After updating the controller feel free to just wait for it to reload.

If you prefer not to have this feature enabled, take a look at `core.yaml` file in the root of your project.

## NPM start

This will be our main application, so it will be nice to have a script to start it. Lets add a new script to our `package.json`:

```json:title=package.json
{
  "scripts": {
    "start": "ucore run express-controllers"
  }
}
```

## Summary

Now we have the endpoints to create, update, delete and list todo items. In the next champer we will start creating the frontend to interact with these endpoints.
