import React, { useState } from "react";
import Button from "./Button";

export default function Todo ({ 
  todo, 
  handleDone,
  handleRemoveTodo,
 }){
  const [label, setLabel] = useState(todo.task);  
  const [isDisabled, setIsDisabled] = useState(true);

  const handleChange = (e) => {
    setLabel(e.target.innerText);
    setIsDisabled(false);
  };

  const handleSave = () => {
    todo.task = label;
    const todoex = {...todo, done: !todo.done}
    handleDone(todoex, label)
    setIsDisabled(true);
  };

  return (
    <li className="list-group-item d-flex align-items-baseline list-unstyled">
      <input
        type="checkbox"
        id={"done" + todo.id}
        className="mr-4"
        onChange={() => handleDone(todo, label)}
        defaultChecked={todo.done}
      />
      <label
        contentEditable={true}
        onBlur={handleSave}
        onInput={handleChange}
        suppressContentEditableWarning={true}
        style={{ cursor: "text", width: "100%", textAlign: "left",  marginRight: '1.5rem', padding: '0.4rem 2rem', fontSize: '1.2rem' }}
      >
        {todo.done ? <s>{label}</s> : label}
      </label>
      <Button
        className="btn btn-primary"
        onClick={handleSave}
        disabled={isDisabled}
      >
        Save
      </Button>
      <Button
        className="btn btn-danger ml-auto ml-md-2"
        onClick={() => handleRemoveTodo(todo)}
      >
        Delete
      </Button>
    </li>
  );
};
