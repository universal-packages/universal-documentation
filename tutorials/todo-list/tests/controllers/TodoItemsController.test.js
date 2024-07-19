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
