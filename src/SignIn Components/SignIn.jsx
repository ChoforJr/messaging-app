import styles from "./signIn.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";
const apiUrl = import.meta.env.VITE_BLOG_API_URL;

const SignIn = () => {
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  const { setAuth } = useContext(ItemContext);

  function onChangeHandler(event) {
    const { name, value } = event.target;
    setLogin((prevLogin) => ({
      ...prevLogin,
      [name]: value,
    }));
  }
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (login.username == "" || login.password == "") {
      return alert("You need to fill in all the field");
    }

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.removeItem("authorization");
        localStorage.setItem("authorization", `Bearer ${data.token}`);
        setAuth(true);
        navigate("/account", { replace: true });
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  return (
    <div className={styles.signIn}>
      <label htmlFor="username">
        Username:{" "}
        <input
          type="email"
          name="username"
          id="username"
          value={login.username}
          onChange={onChangeHandler}
        />
      </label>
      <label htmlFor="password">
        Password:{" "}
        <input
          type="password"
          name="password"
          id="password"
          value={login.password}
          onChange={onChangeHandler}
        />
      </label>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default SignIn;
