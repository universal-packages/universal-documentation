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
        onItemAdded(data.todoItem);
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
