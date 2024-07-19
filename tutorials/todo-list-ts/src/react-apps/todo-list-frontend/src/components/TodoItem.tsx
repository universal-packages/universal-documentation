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
