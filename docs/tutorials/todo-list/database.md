---
slug: /tutorials/todo-list/database
title: Database
navigationId: todo-list-database
---

# Database

To handle our TodoList app database, we will use the [universal-core-typeorm](https://github.com/universal-packages/universal-core-typeorm) which is a universal core abstraction of the typeorm package. It makes a data source available across the application.

## TypeORM

First, we need to install the universal-core-typeorm package:

```bash
npm install @universal-packages/core-typeorm
```

Universal core packages are equipped with an initializer to prepare everything for you. You can initialize the universal-core-typeorm package by running the following command:

```bash
ucore initialize typeorm
```

Or if you are using typescript:

```bash
ucore initialize typeorm --typescript
```

This has populated our project with configuration files and the common folder structure for typeorm. It also by default prepares the `postgres` driver for us.

> Make sure you have a postgresql server running on your machine or the database you are using.

```yaml:title=.src/config/typeorm-module.yaml
default:
  dataSource:
    type: postgres

development:
  dataSource:
    database: todo-list-development

test:
  dataSource:
    database: todo-list-test-{{ JEST_WORKER_ID }}

production:
  dataSource:
    database: todo-list-production
```

As you can see it has automatically set our type to the given type at initialization. And also naming the databases based on our project name.

If you want to use a different driver, you can specify it by adding the `--type` flag:

```bash
ucore initialize typeorm --type mysql
```

## Datebase creation

Core typeorm offers a command to create the database for you. You can run the following command:

```bash
ucore exec typeorm db:create
```

This will do two things:

1. Create the database `todo-list-development` if it does not exist.
2. Create the database `todo-list-test` if it does not exist as well as a `todo-list-test-<number>` database for each available processor core in your machine. This is useful for running tests in parallel.
