import React, { useState } from "react";

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", true);
      } else {
        alert("Invalid username or password.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container my-5">
      <form onSubmit={handleSubmit}>
        <h2 style={{color: 'white'}}>Login</h2>
        <hr />
        <div className="form-group">
          <label style={{color: 'white'}} htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label style={{color: 'white'}} htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
