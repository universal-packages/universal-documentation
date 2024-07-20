---
slug: /tutorials/todo-list/testing
title: Testing
navigationId: todo-list-testing
---

# Testing

Let's write some tests for our TodoList core application. We will use the testing utility for universal-core apps, [universal-core-jest](https://github.com/universal-packages/universal-core-jest), to help us write tests accessing the core application functionality.

## Universal Core Jest

Let's install the universal-core-jest package:

```bash
npm install @universal-packages/core-jest --save-dev
```

Universal-packages also provide a fetch utility to test fetch requests to our controllers:

```bash
npm install @universal-packages/fetch-jest --save-dev
```

And finally, we also need the testing utility for core-typeorm:

```bash
npm install @universal-packages/core-typeorm-jest --save-dev
```

We need to configure Jest to make use of these utilities:

Let's add the following to our `jest.config.js` file:

```json
{
  "setupFilesAfterEnv": [
    "@universal-packages/core-jest",
    "@universal-packages/core-typeorm-jest",
    "@universal-packages/fetch-jest"
  ]
}
```

<ts-only>

Let's also make the global types for these tools available in our tests. Create a new file `tests/global.d.ts` with the following content:

```ts:title=tests/global.d.ts
/// <reference types="@universal-packages/core-jest" />
/// <reference types="@universal-packages/fetch-jest" />
```

</ts-only>

## Testing the TodoItemsController

Let's write some tests for the `TodoItemsController` class. For this, we will run our app using the core-jest tools and make requests to the core application. This approach lets us test our app's functionality exactly as in real-world usage.

Create a new file <js-only> `tests/controllers/TodoItemsController.test.js` </js-only><ts-only> `tests/controllers/TodoItemsController.test.ts` </ts-only> with the following content:

```js:title=tests/controllers/TodoItemsController.test.js
import TodoItemsController from "../../src/controllers/TodoItems.controller";
import { TodoItem } from "../../src/entity/TodoItem";

coreJest.runApp("express-controllers");

describe(TodoItemsController, () => {
  describe("index", () => {
    it("should return all todo items", async () => {
      const item1 = new TodoItem();
      item1.content = "Item 1";
      item1.done = false;
      await item1.save();

      const item2 = new TodoItem();
      item2.content = "Item 2";
      item2.done = true;
      await item2.save();

      await fGet(`todo-items`);

      expect(fResponse).toHaveReturnedWithStatus("OK");
      expect(fResponseBody).toEqual({
        todoItems: [
          {
            id: expect.any(String),
            content: "Item 1",
            done: false,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          {
            id: expect.any(String),
            content: "Item 2",
            done: true,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ],
      });
    });
  });
});
```

```ts:title=tests/controllers/TodoItemsController.test.ts
import TodoItemsController from "../../src/controllers/TodoItems.controller";
import { TodoItem } from "../../src/entity/TodoItem";

coreJest.runApp("express-controllers");

describe(TodoItemsController, (): void => {
  describe("index", (): void => {
    it("should return all todo items", async (): Promise<void> => {
      const item1 = new TodoItem();
      item1.content = "Item 1";
      item1.done = false;
      await item1.save();

      const item2 = new TodoItem();
      item2.content = "Item 2";
      item2.done = true;
      await item2.save();

      await fGet(`todo-items`);

      expect(fResponse).toHaveReturnedWithStatus("OK");
      expect(fResponseBody).toEqual({
        todoItems: [
          {
            id: expect.any(String),
            content: "Item 1",
            done: false,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          {
            id: expect.any(String),
            content: "Item 2",
            done: true,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ],
      });
    });
  });
});
```

This test will create two todo items in the database and then make a request using the universal-fetch-jest utility to the `todo-items` endpoint. After that, it will check if the response is as expected using the `fResponse` and `fResponseBody` utilities from universal-fetch-jest.

Now let's run the tests:

```bash
npm test
```

You should see the following error:

```
FetchError: request to http://localhost:4001/todo-items failed, reason: connect ECONNREFUSED 127.0.0.1:4001
```

This tells us we need to configure the express-controllers app to run on port 4000 when running tests.

Let's add the following to `src/config/express-controllers-app.yaml`:

```yaml
test:
  host: localhost
  port: <% 4000 + {{ JEST_WORKER_ID }} %>
```

The `JEST_WORKER_ID` environment variable is provided by Jest and is used to run multiple tests in parallel. Now, when running tests in parallel, we will isolate our app for this particular test file. Also, remember that in the Database section, we configured the database to use a different database for each test, also using the `JEST_WORKER_ID`.

Additionally, you can evaluate expressions in the YAML file using the `<% %>` syntax. This is useful for working with environment variables.

### Testing the create endpoint

Let's write a test for the create endpoint. Add the following test to the file:

```js:title=tests/controllers/TodoItemsController.test.js
  describe("create", () => {
    it("should create a new todo item", async () => {
      await fPost("todo-items", { content: "New item" });

      expect(fResponse).toHaveReturnedWithStatus("CREATED");
      expect(fResponseBody).toEqual({
        todoItem: {
          id: expect.any(String),
          content: "New item",
          done: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
      expect(await TodoItem.count()).toBe(1);
    });
  });
```

```ts:title=tests/controllers/TodoItemsController.test.ts
  describe("create", (): void => {
    it("should create a new todo item", async (): Promise<void> => {
      await fPost("todo-items", { content: "New item" });

      expect(fResponse).toHaveReturnedWithStatus("CREATED");
      expect(fResponseBody).toEqual({
        todoItem: {
          id: expect.any(String),
          content: "New item",
          done: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
      expect(await TodoItem.count()).toBe(1);
    });
  });
```

This test will create a new todo item using the `todo-items` endpoint and then check if the response is as expected and if the item was created in the database.

### Testing the update endpoint

Let's write a test for the update endpoint. Add the following test to the file:

```js:title=tests/controllers/TodoItemsController.test.js
  describe("update", () => {
    it("should update a todo item content attribute", async () => {
      const item = new TodoItem();
      item.content = "Item";
      item.done = false;
      await item.save();

      await fPut(`todo-items/${item.id}`, { content: "Updated item" });

      expect(fResponse).toHaveReturnedWithStatus("OK");
      expect(fResponseBody).toEqual({
        todoItem: {
          id: item.id,
          content: "Updated item",
          done: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });

    it("should update a todo item done attribute", async () => {
      const item = new TodoItem();
      item.content = "Item";
      item.done = false;
      await item.save();

      await fPut(`todo-items/${item.id}`, { done: true });

      expect(fResponse).toHaveReturnedWithStatus("OK");
      expect(fResponseBody).toEqual({
        todoItem: {
          id: item.id,
          content: "Item",
          done: true,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });

    it("should return 404 if todo item not found", async () => {
      await fPut(`todo-items/1`, { done: true });

      expect(fResponse).toHaveReturnedWithStatus("NOT_FOUND");
    });
  });
```

```ts:title=tests/controllers/TodoItemsController.test.ts
  describe("update", (): void => {
    it("should update a todo item content attribute", async (): Promise<void> => {
      const item = new TodoItem();
      item.content = "Item";
      item.done = false;
      await item.save();

      await fPut(`todo-items/${item.id}`, { content: "Updated item" });

      expect(fResponse).toHaveReturnedWithStatus("OK");
      expect(fResponseBody).toEqual({
        todoItem: {
          id: item.id,
          content: "Updated item",
          done: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });

    it("should update a todo item done attribute", async (): Promise<void> => {
      const item = new TodoItem();
      item.content = "Item";
      item.done = false;
      await item.save();

      await fPut(`todo-items/${item.id}`, { done: true });

      expect(fResponse).toHaveReturnedWithStatus("OK");
      expect(fResponseBody).toEqual({
        todoItem: {
          id: item.id,
          content: "Item",
          done: true,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });

    it("should return 404 if todo item not found", async (): Promise<void> => {
      await fPut(`todo-items/1`, { done: true });

      expect(fResponse).toHaveReturnedWithStatus("NOT_FOUND");
    });
  });
```

This test will create a todo item in the database and then update its content and done attributes using the `todo-items` endpoint. It will also check if the response is as expected and if the item was updated in the database.

### Testing the delete endpoint

Lets write a test for the delete endpoint. Add the following test to the file:

```js:title=tests/controllers/TodoItemsController.test.js
  describe("delete", () => {
    it("should delete a todo item", async () => {
      const item = new TodoItem();
      item.content = "Item";
      item.done = false;
      await item.save();

      await fDelete(`todo-items/${item.id}`);

      expect(fResponse).toHaveReturnedWithStatus("NO_CONTENT");
      expect(await TodoItem.count()).toBe(0);
    });

    it("should return 404 if todo item not found", async () => {
      await fDelete(`todo-items/1`);

      expect(fResponse).toHaveReturnedWithStatus("NOT_FOUND");
    });
  });
```

```ts:title=tests/controllers/TodoItemsController.test.ts
  describe("delete", (): void => {
    it("should delete a todo item", async (): Promise<void> => {
      const item = new TodoItem();
      item.content = "Item";
      item.done = false;
      await item.save();

      await fDelete(`todo-items/${item.id}`);

      expect(fResponse).toHaveReturnedWithStatus("NO_CONTENT");
      expect(await TodoItem.count()).toBe(0);
    });

    it("should return 404 if todo item not found", async (): Promise<void> => {
      await fDelete(`todo-items/1`);

      expect(fResponse).toHaveReturnedWithStatus("NOT_FOUND");
    });
  });
```

This test will create a todo item in the database and then delete it using the `todo-items` endpoint. It will also check if the response is as expected and if the item was deleted from the database.

### Final tests file

This is how the final `TodoItemsController.test.js` file should look like:

```js:title=tests/controllers/TodoItemsController.test.js
import TodoItemsController from "../../src/controllers/TodoItems.controller";
import { TodoItem } from "../../src/entity/TodoItem";

coreJest.runApp("express-controllers");

describe(TodoItemsController, () => {
  describe("index", () => {
    it("should return all todo items", async () => {
      const item1 = new TodoItem();
      item1.content = "Item 1";
      item1.done = false;
      await item1.save();

      const item2 = new TodoItem();
      item2.content = "Item 2";
      item2.done = true;
      await item2.save();

      await fGet(`todo-items`);

      expect(fResponse).toHaveReturnedWithStatus("OK");
      expect(fResponseBody).toEqual({
        todoItems: [
          {
            id: expect.any(String),
            content: "Item 1",
            done: false,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          {
            id: expect.any(String),
            content: "Item 2",
            done: true,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ],
      });
    });
  });

  describe("create", () => {
    it("should create a new todo item", async () => {
      await fPost("todo-items", { content: "New item" });

      expect(fResponse).toHaveReturnedWithStatus("CREATED");
      expect(fResponseBody).toEqual({
        todoItem: {
          id: expect.any(String),
          content: "New item",
          done: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
      expect(await TodoItem.count()).toBe(1);
    });
  });

  describe("update", () => {
    it("should update a todo item content attribute", async () => {
      const item = new TodoItem();
      item.content = "Item";
      item.done = false;
      await item.save();

      await fPut(`todo-items/${item.id}`, { content: "Updated item" });

      expect(fResponse).toHaveReturnedWithStatus("OK");
      expect(fResponseBody).toEqual({
        todoItem: {
          id: item.id,
          content: "Updated item",
          done: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });

    it("should update a todo item done attribute", async () => {
      const item = new TodoItem();
      item.content = "Item";
      item.done = false;
      await item.save();

      await fPut(`todo-items/${item.id}`, { done: true });

      expect(fResponse).toHaveReturnedWithStatus("OK");
      expect(fResponseBody).toEqual({
        todoItem: {
          id: item.id,
          content: "Item",
          done: true,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });

    it("should return 404 if todo item not found", async () => {
      await fPut(`todo-items/1`, { done: true });

      expect(fResponse).toHaveReturnedWithStatus("NOT_FOUND");
    });
  });

  describe("delete", () => {
    it("should delete a todo item", async () => {
      const item = new TodoItem();
      item.content = "Item";
      item.done = false;
      await item.save();

      await fDelete(`todo-items/${item.id}`);

      expect(fResponse).toHaveReturnedWithStatus("NO_CONTENT");
      expect(await TodoItem.count()).toBe(0);
    });

    it("should return 404 if todo item not found", async () => {
      await fDelete(`todo-items/1`);

      expect(fResponse).toHaveReturnedWithStatus("NOT_FOUND");
    });
  });
});
```

```ts:title=tests/controllers/TodoItemsController.test.ts
import TodoItemsController from "../../src/controllers/TodoItems.controller";
import { TodoItem } from "../../src/entity/TodoItem";

coreJest.runApp("express-controllers");

describe(TodoItemsController, (): void => {
  describe("index", (): void => {
    it("should return all todo items", async (): Promise<void> => {
      const item1 = new TodoItem();
      item1.content = "Item 1";
      item1.done = false;
      await item1.save();

      const item2 = new TodoItem();
      item2.content = "Item 2";
      item2.done = true;
      await item2.save();

      await fGet(`todo-items`);

      expect(fResponse).toHaveReturnedWithStatus("OK");
      expect(fResponseBody).toEqual({
        todoItems: [
          {
            id: expect.any(String),
            content: "Item 1",
            done: false,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          {
            id: expect.any(String),
            content: "Item 2",
            done: true,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ],
      });
    });
  });

  describe("create", (): void => {
    it("should create a new todo item", async (): Promise<void> => {
      await fPost("todo-items", { content: "New item" });

      expect(fResponse).toHaveReturnedWithStatus("CREATED");
      expect(fResponseBody).toEqual({
        todoItem: {
          id: expect.any(String),
          content: "New item",
          done: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
      expect(await TodoItem.count()).toBe(1);
    });
  });

  describe("update", (): void => {
    it("should update a todo item content attribute", async (): Promise<void> => {
      const item = new TodoItem();
      item.content = "Item";
      item.done = false;
      await item.save();

      await fPut(`todo-items/${item.id}`, { content: "Updated item" });

      expect(fResponse).toHaveReturnedWithStatus("OK");
      expect(fResponseBody).toEqual({
        todoItem: {
          id: item.id,
          content: "Updated item",
          done: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });

    it("should update a todo item done attribute", async (): Promise<void> => {
      const item = new TodoItem();
      item.content = "Item";
      item.done = false;
      await item.save();

      await fPut(`todo-items/${item.id}`, { done: true });

      expect(fResponse).toHaveReturnedWithStatus("OK");
      expect(fResponseBody).toEqual({
        todoItem: {
          id: item.id,
          content: "Item",
          done: true,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });

    it("should return 404 if todo item not found", async (): Promise<void> => {
      await fPut(`todo-items/1`, { done: true });

      expect(fResponse).toHaveReturnedWithStatus("NOT_FOUND");
    });
  });

  describe("delete", (): void => {
    it("should delete a todo item", async (): Promise<void> => {
      const item = new TodoItem();
      item.content = "Item";
      item.done = false;
      await item.save();

      await fDelete(`todo-items/${item.id}`);

      expect(fResponse).toHaveReturnedWithStatus("NO_CONTENT");
      expect(await TodoItem.count()).toBe(0);
    });

    it("should return 404 if todo item not found", async (): Promise<void> => {
      await fDelete(`todo-items/1`);

      expect(fResponse).toHaveReturnedWithStatus("NOT_FOUND");
    });
  });
});
```

## Summary

In this part of the tutorial we wrote some tests for our TodoList core application using the universal-core-jest utility. We tested the `TodoItemsController` class by making requests to the core application and checking if the responses were as expected.
