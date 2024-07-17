---
slug: /tutorials/todo-list/database-models
title: Database Models
navigationId: todo-list-database-models
---

# Database Models

For our TodoList application, we want to be able to store the items in our list in our database, lets create a new model to represent the items in our list. Or as TypeORM calls it, an entity.

## Create a new entity

Core typeorm provide the same functionality as the typeorm package cli, lets use the entity generator to create a new entity for our TodoItem.

```bash
ucore exec typeorm entity:create --name TodoItem
```

This will create a new file in the `src/entity` directory called `TodoItem.ts`.

<js-only>

Typeorm is optimized for typescript so once generated if you are using javascript you will need to change the file extension to `.js` and remove the types from the file.

we need to enable the `@babel/plugin-proposal-decorators` in your `.babelrc` file.

```shell
npm install  @babel/plugin-proposal-decorators
```

```json:title=.babelrc
{
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread"
  ]
}
```

</js-only>

This is how our `TodoItem` entity should look like:

```js:title=src/entity/TodoItem.js
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class TodoItem extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id;

  @Column({ type: "text" })
  content;
  @Column({ type: "boolean" })
  done;

  @CreateDateColumn()
  createdAt;
  @UpdateDateColumn()
  updatedAt;
}
```

We have added a few columns to our entity:

- `id`: This is the primary key of our entity, it is a unique identifier for each item in our list.
- `content`: This is the text of the item in our list.
- `done`: This is a boolean value that represents if the item is done or not.
- `createdAt`: This is a timestamp that represents when the item was created.
- `updatedAt`: This is a timestamp that represents when the item was last updated.

We also have extended our entity from `BaseEntity`, this will give us access to some helper methods that we can use to interact with our database.

## Core console

Universal Core provides a way for you tests code without having to write a test file or print statements. Lets enter the universal core console and test our new entity.

```bash
ucore console
```

Once inside the console, we can import our entity and create a new instance of it. You can now write any JavaScript code you want to test.

```javascript
const { TodoItem } = require("./src/entity/TodoItem")
```

Lets create a entry of our entity by instantiating it and setting the content and done properties and save it to the database.

```javascript
const todoItem = new TodoItem()

todoItem.content = "Buy milk"
todoItem.done = false

await todoItem.save()
```

You can now query the database to see if the item was saved.

```javascript
await TodoItem.find()
```

## Summary

In this part of the tutorial, we have created a new entity to represent the items in our TodoList application. We have also used the Universal Core console to test our new entity.