import "./App.css";
import TodoList from "./components/TodoList";

function App() {
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
