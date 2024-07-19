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
