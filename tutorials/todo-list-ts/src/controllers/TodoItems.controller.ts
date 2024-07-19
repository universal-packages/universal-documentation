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
  public async index(): Promise<this> {
    const todoItems = await TodoItem.find();

    return this.status("OK").json({ todoItems });
  }

  @Post({ bodyParser: "json" })
  public async create(): Promise<this> {
    const todoItem = new TodoItem();
    todoItem.content = this.request.body.content;
    todoItem.done = false;
    await todoItem.save();

    return this.status("CREATED").json({ todoItem });
  }

  @Put("/:id", { bodyParser: "json" })
  public async update(): Promise<this> {
    try {
      const todoItem = await TodoItem.findOneOrFail({
        where: { id: this.request.params.id },
      });
      if (this.request.body.content)
        todoItem.content = this.request.body.content;
      if (this.request.body.done !== undefined)
        todoItem.done = this.request.body.done;
      await todoItem.save();

      return this.status("OK").json({ todoItem });
    } catch (error) {
      return this.status("NOT_FOUND");
    }
  }

  @Delete("/:id")
  public async delete(): Promise<this> {
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
