---
slug: /tutorials/todo-list/frontend
title: Frontend
navigationId: todo-list-frontend
---

# Frontend

Now that we have our backend set up, it's time to create our frontend. We will use React to create our frontend application, specifically the officially supported way to create single-page applications with React, [Create React App](https://create-react-app.dev/). Of course, universal-packages offers an abstraction to make it easier to integrate a Create React App into your core application.

## Core Create React App

First, we need to install the universal-core-create-react-app package:

```bash
npm install @universal-packages/core-create-react-app
```

Let's initialize a new Create React App project by running the following command:

<js-only>

```bash
ucore initialize create-react-app --name todo-list-frontend
```

</js-only>

<ts-only>

```bash
ucore initialize create-react-app --name todo-list-frontend --typescript
```

</ts-only>

This will create a new Create React App project in the `.src/react-apps/todo-list-frontend` directory.

## Run the frontend

To run the frontend, we just need to run the core app included in the `universal-core-create-react-app` package:

```bash
ucore run create-react-app --name todo-list-frontend
```

## Multiple React Apps

As you might figure out, you can create multiple React apps in the same project. Just run the `ucore initialize create-react-app` command again with a different `--name` parameter, and run them by specifying the `--name` parameter in the `ucore run create-react-app` command.

## React App

Now that we have our frontend set up, let's start building our React app components that will communicate with our backend. We will create `TodoList`, `TodoItem`, and `NewTodoItem` components.

### TodoItem Component

Let's create a `TodoItem` component that will display a todo item. Create a new file <js-only> `TodoItem.jsx` </js-only><ts-only> `TodoItem.tsx` </ts-only> in the `src/react-apps/todo-list-frontend/src/components` directory:

```jsx:title=src/react-apps/todo-list-frontend/src/components/TodoItem.jsx
import React from "react";

const API_URL = "http://localhost:3000/todo-items";

const TodoItem = ({ item, onToggle, onDelete }) => {
  const handleToggle = () => {
    fetch(`${API_URL}/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ done: !item.done }),
    })
      .then((response) => response.json())
      .then((data) => {
        onToggle({
          ...data.todoItem,
          createdAt: new Date(data.todoItem.createdAt),
          updatedAt: new Date(data.todoItem.updatedAt),
        });
      });
  };

  const handleDelete = () => {
    fetch(`${API_URL}/${item.id}`, {
      method: "DELETE",
    }).then(() => {
      onDelete(item);
    });
  };

  return (
    <div className="todo-item">
      <input type="checkbox" checked={item.done} onChange={handleToggle} />
      <p>{item.content}</p>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default TodoItem;
```

```tsx:title=src/react-apps/todo-list-frontend/src/components/TodoItem.tsx
import React from "react";

const API_URL = "http://localhost:3000/todo-items";

export interface TodoItemEntry {
  id: number;
  content: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoItemProps {
  item: TodoItemEntry;
  onToggle: (item: TodoItemEntry) => void;
  onDelete: (item: TodoItemEntry) => void;
}

const TodoItem = ({
  item,
  onToggle,
  onDelete,
}: TodoItemProps): React.ReactElement => {
  const handleToggle = (): void => {
    fetch(`${API_URL}/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ done: !item.done }),
    })
      .then((response) => response.json())
      .then((data) => {
        onToggle({
          ...data.todoItem,
          createdAt: new Date(data.todoItem.createdAt),
          updatedAt: new Date(data.todoItem.updatedAt),
        });
      });
  };

  const handleDelete = (): void => {
    fetch(`${API_URL}/${item.id}`, {
      method: "DELETE",
    }).then(() => {
      onDelete(item);
    });
  };

  return (
    <div className="todo-item">
      <input type="checkbox" checked={item.done} onChange={handleToggle} />
      <p>{item.content}</p>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default TodoItem;
```

This component will display a todo item with a checkbox to toggle the done state and a delete button to delete the todo item. The `handleToggle` and `handleDelete` functions will make requests to the backend to update and delete the todo item, respectively.

### NewTodoItem Component

Let's create a `NewTodoItem` component that will allow the user to create a new todo item. Create a new file <js-only> `NewTodoItem.jsx` </js-only><ts-only> `NewTodoItem.tsx` </ts-only> in the `src/react-apps/todo-list-frontend/src/components` directory:

```jsx:title=src/react-apps/todo-list-frontend/src/components/NewTodoItem.jsx
import React from "react";

const API_URL = "http://localhost:3000/todo-items";

const NewTodoItem = ({ onItemAdded }) => {
  const [content, setContent] = React.useState("");

  const handleAdd = () => {
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    })
      .then((response) => response.json())
      .then((data) => {
        onItemAdded({
          ...data.todoItem,
          createdAt: new Date(data.todoItem.createdAt),
          updatedAt: new Date(data.todoItem.updatedAt),
        });
        setContent("");
      });
  };

  return (
    <div className="new-todo-item-form">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Whats needs to be done?"
      />
      <button onClick={handleAdd} disabled={!content}>
        Add
      </button>
    </div>
  );
};

export default NewTodoItem;
```

```tsx:title=src/react-apps/todo-list-frontend/src/components/NewTodoItem.tsx
import React from "react";
import { TodoItemEntry } from "./TodoItem";

const API_URL = "http://localhost:3000/todo-items";

export interface TodoItemProps {
  onItemAdded: (item: TodoItemEntry) => void;
}

const NewTodoItem = ({ onItemAdded }: TodoItemProps): React.ReactElement => {
  const [content, setContent] = React.useState("");

  const handleAdd = (): void => {
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    })
      .then((response) => response.json())
      .then((data) => {
        onItemAdded({
          ...data.todoItem,
          createdAt: new Date(data.todoItem.createdAt),
          updatedAt: new Date(data.todoItem.updatedAt),
        });
        setContent("");
      });
  };

  return (
    <div className="new-todo-item-form">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Whats needs to be done?"
      />
      <button onClick={handleAdd} disabled={!content}>
        Add
      </button>
    </div>
  );
};

export default NewTodoItem;
```

This component will display a form with an input field to enter the content of the new todo item and a button to add the todo item. The `handleAdd` function will make a request to the backend to create the todo item.

### TodoList Component

Let's create a `TodoList` component that will display a list of todo items as well as the <js-only> `NewTodoItem` </js-only><ts-only> `NewTodoItem` </ts-only> component. Create a new file <js-only> `TodoList.jsx` </js-only><ts-only> `TodoList.tsx` </ts-only> in the `src/react-apps/todo-list-frontend/src/components` directory:

```jsx:title=src/react-apps/todo-list-frontend/src/components/TodoList.jsx
import React from "react";
import NewTodoItem from "./NewTodoItem";
import TodoItem from "./TodoItem";

const API_URL = "http://localhost:3000/todo-items";

const TodoList = () => {
  const [todoItems, setTodoItems] = React.useState([]);

  React.useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setTodoItems(
          data.todoItems.map((item) => ({
            ...item,
            updatedAt: new Date(item.updatedAt),
            createdAt: new Date(item.createdAt),
          }))
        );
      });
  }, []);

  const handleItemAdded = (item) => {
    setTodoItems([item, ...todoItems]);
  };

  const handleItemToggle = (changedItem) => {
    setTodoItems((items) =>
      items.map((item) => (item.id === changedItem.id ? changedItem : item))
    );
  };

  const handleItemDelete = (deletedItem) => {
    setTodoItems((items) => items.filter((item) => item.id !== deletedItem.id));
  };

  return (
    <div className="todo-list">
      <NewTodoItem onItemAdded={handleItemAdded} />
      <h2>Pending items</h2>
      <div>
        {todoItems
          .filter((item) => !item.done)
          .sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())
          .map((item) => (
            <TodoItem
              key={item.id}
              item={item}
              onToggle={handleItemToggle}
              onDelete={handleItemDelete}
            />
          ))}
      </div>
      <h2>Done items</h2>
      <div>
        {todoItems
          .filter((item) => item.done)
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
          .map((item) => (
            <TodoItem
              key={item.id}
              item={item}
              onToggle={handleItemToggle}
              onDelete={handleItemDelete}
            />
          ))}
      </div>
    </div>
  );
};

export default TodoList;
```

```tsx:title=src/react-apps/todo-list-frontend/src/components/TodoList.tsx
import React from "react";
import NewTodoItem from "./NewTodoItem";
import TodoItem, { TodoItemEntry } from "./TodoItem";

const API_URL = "http://localhost:3000/todo-items";

const TodoList = (): React.ReactElement => {
  const [todoItems, setTodoItems] = React.useState<TodoItemEntry[]>([]);

  React.useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setTodoItems(
          data.todoItems.map((item: TodoItemEntry) => ({
            ...item,
            updatedAt: new Date(item.updatedAt),
            createdAt: new Date(item.createdAt),
          }))
        );
      });
  }, []);

  const handleItemAdded = (item: TodoItemEntry): void => {
    setTodoItems([item, ...todoItems]);
  };

  const handleItemToggle = (changedItem: TodoItemEntry): void => {
    setTodoItems((items) =>
      items.map((item) => (item.id === changedItem.id ? changedItem : item))
    );
  };

  const handleItemDelete = (deletedItem: TodoItemEntry): void => {
    setTodoItems((items) => items.filter((item) => item.id !== deletedItem.id));
  };

  return (
    <div className="todo-list">
      <NewTodoItem onItemAdded={handleItemAdded} />
      <h2>Pending items</h2>
      <div>
        {todoItems
          .filter((item) => !item.done)
          .sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())
          .map((item) => (
            <TodoItem
              key={item.id}
              item={item}
              onToggle={handleItemToggle}
              onDelete={handleItemDelete}
            />
          ))}
      </div>
      <h2>Done items</h2>
      <div>
        {todoItems
          .filter((item) => item.done)
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
          .map((item) => (
            <TodoItem
              key={item.id}
              item={item}
              onToggle={handleItemToggle}
              onDelete={handleItemDelete}
            />
          ))}
      </div>
    </div>
  );
};

export default TodoList;
```

This component will display a list of todo items, sorted by done state and update date. It will also display the `NewTodoItem` component to allow the user to create new todo items.

### App Component

Lets update our `App` component to display the `TodoList` component. Update the `App` component in the `src/react-apps/todo-list-frontend/src` directory:

```jsx:title=src/react-apps/todo-list-frontend/src/App.jsx
import React from "react";
import "./App.css";
import TodoList from "./components/TodoList";

function App(): React.ReactElement {
  return (
    <div className="app">
      <div className="wrapper">
        <h1>Todo List</h1>
        <TodoList />
      </div>
    </div>
  );
}

export default App;
```

```tsx:title=src/react-apps/todo-list-frontend/src/App.tsx
import React from "react";
import "./App.css";
import TodoList from "./components/TodoList";

function App(): React.ReactElement {
  return (
    <div className="app">
      <div className="wrapper">
        <h1>Todo List</h1>
        <TodoList />
      </div>
    </div>
  );
}

export default App;
```

### CSS

Let's add some CSS to style our components. Let's modify the `App.css` file in the `src/react-apps/todo-list-frontend/src` directory:

```css:title=src/react-apps/todo-list-frontend/src/App.css
#root {
  height: 100%;
}

.app {
  display: flex;
  justify-content: center;
  height: 100%;
  background-color: rgb(249, 249, 249);
  padding: 20px;
}

h1 {
  color: rgb(58, 58, 58);
  font-size: 3.5rem;
}

h2 {
  color: rgb(58, 58, 58);
  font-size: 2.5rem;
}

.wrapper {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.todo-list {
  width: 100%;
}

.new-todo-item-form {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.new-todo-item-form input {
  flex-grow: 1;
  padding: 0.5rem;
  font-size: 1.5rem;
  margin-right: 10px;

  border: 4px solid rgb(58, 58, 58);
  border-radius: 10px;

  outline: none;
}

.new-todo-item-form button {
  padding: 1rem;
  font-size: 1.5rem;
  background-color: rgb(58, 58, 58);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.new-todo-item-form button:hover {
  background-color: rgb(0, 0, 0);
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-top: 1rem;
  background-color: white;
  border: 4px solid rgb(58, 58, 58);
  border-radius: 10px;
}

.todo-item input[type="checkbox"] {
  margin-right: 20px;
  transform: scale(2.5);
}

.todo-item p {
  flex-grow: 1;
  font-size: 1.5rem;
  background-color: rgb(249, 249, 249);
  padding: 10px;
  border-radius: 10px;
}

.todo-item button {
  padding: 1rem;
  font-size: 1rem;
  background-color: rgb(138, 0, 0);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-left: 10px;
}
```

### NPM run frontend

Let's add a new script to our `package.json` to run the frontend:

```json:title=package.json
{
  "scripts": {
    "frontend": "ucore run create-react-app --name todo-list-frontend"
  }
}
```

### Summary

We have created a frontend application using React that displays a list of todo items, allows the user to create new todo items, toggle the done state of todo items, and delete todo items. We have also styled the components using CSS.
