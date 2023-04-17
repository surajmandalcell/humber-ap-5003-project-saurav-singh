import React, { useState, useEffect } from "react";
import "./App.css";
import Todos from "./components/Todos";
import ViewToggle from "./components/ViewToggle";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [showDone, setShowDone] = useState(false);

  const handleDone = (todo, label) => {
    const index = todos.indexOf(todo);

    const putData = {
      method: "PUT",
      body: JSON.stringify({ done: !todo.done, task: label }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch("/todos/" + todo.id, putData)
      .then((response) => response.json())
      .then(({ todo }) => {
        const newTodos = [...todos];
        newTodos[index] = { id: todo.id, task: todo.task, done: todo.done };
        setTodos(newTodos);
      })
      .catch((error) => console.log(error));
  };

  const handleAddTodo = (task) => {
    const postData = {
      method: "POST",
      body: JSON.stringify({ task: task }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch("/todos/", postData)
      .then((response) => response.json())
      .then(({ todo }) => {
        setTodos([...todos, { id: todo.id, task: todo.task, done: todo.done }]);
        setShowDone(false);
      })
      .catch((error) => console.log(error));
  };

  const handleRemoveTodo = (todo) => {
    const deleteData = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch("/todos/" + todo.id, deleteData)
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          const newTodos = todos.filter((td) => td !== todo);
          setTodos(newTodos);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleViewToggle = (bool) => setShowDone(bool);

  const todosSelector = () => {
    if (showDone) {
      return todos.filter((td) => td.done);
    }
    return todos.filter((td) => td.done === false);
  };

  useEffect(() => {
    fetch("/todos/")
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="container-fluid mt-5">
      <div className="row justify-content-center">
        <div className="col-8">
          <div className="card text-center">
            <div className="card-header">
              <ul className="nav card-header-pills justify-content-center">
                <li className="nav-item">
                  <ViewToggle
                    handleViewToggle={handleViewToggle}
                    showDone={showDone}
                  />
                </li>
              </ul>
            </div>
            <Todos
              todos={todosSelector()}
              handleDone={handleDone}
              handleRemoveTodo={handleRemoveTodo}
              handleAddTodo={handleAddTodo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
