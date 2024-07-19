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
