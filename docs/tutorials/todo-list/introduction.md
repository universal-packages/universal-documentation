---
slug: /tutorials/todo-list/introduction
title: Introduction
navigationId: todo-list-introduction
---

# Todo List API

In this tutorial, we will create a TodoList app from the ground up, we will create the database models, an express server using convenient controllers, and a frontend to interact with the API.

> If you haven't follow the [Getting Started](/documentation/getting-started) tutorial, please do so before starting this.

> This tutorial work the same for typescript amd JS projects, if you are using typescript, make sure to add the `--typescript` flag to the commands.

## Project initialization

Lest create our brand new project using the universal-cli:

```bash
ucore new todo-list
```

or

```bash
ucore new todo-list --typescript
```

## Testing

For testing we will use [Jest](https://jestjs.io/), universal packages provide jest extensions to test universal packages functionality, this tutorial will go through the process of testing the universal core app.
