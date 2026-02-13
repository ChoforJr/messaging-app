import styles from "./homePage.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";
const apiUrl = import.meta.env.VITE_BLOG_API_URL;

const HomePage = () => {
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  const [signUp, setSignUp] = useState({
    username: "",
    password: "",
    displayName: "",
  });
  const [signIn, setSignIn] = useState(true);
  const { setAuth } = useContext(ItemContext);

  function onChangeHandlerLogin(event) {
    const { name, value } = event.target;
    setLogin((prevLogin) => ({
      ...prevLogin,
      [name]: value,
    }));
  }

  function onChangeHandlerSignup(event) {
    const { name, value } = event.target;
    setSignUp((prevLogin) => ({
      ...prevLogin,
      [name]: value,
    }));
  }

  function changeSignInState() {
    setSignIn(!signUp);
  }

  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
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
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (
      login.username == "" ||
      login.password == "" ||
      login.displayName == ""
    ) {
      return alert("You need to fill in all the field");
    }

    try {
      const response = await fetch(`${apiUrl}/signUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
      });

      if (response.ok) {
        localStorage.removeItem("authorization");
        setAuth(false);
        navigate("/", { replace: true });
      } else {
        alert("SigningUp failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  return (
    <div className={styles.signIn}>
      <section>
        <button onClick={changeSignInState}>Switch</button>
        {signIn ? (
          <>
            <label htmlFor="username">
              Username:{" "}
              <input
                type="email"
                name="username"
                id="username"
                value={login.username}
                onChange={onChangeHandlerLogin}
              />
            </label>
            <label htmlFor="password">
              Password:{" "}
              <input
                type="password"
                name="password"
                id="password"
                value={login.password}
                onChange={onChangeHandlerLogin}
              />
            </label>
            <button onClick={handleLoginSubmit}>Submit</button>
          </>
        ) : (
          <>
            <label htmlFor="username">
              Username:{" "}
              <input
                type="email"
                name="username"
                id="username"
                value={signUp.username}
                onChange={onChangeHandlerSignup}
              />
            </label>
            <label htmlFor="displayName">
              Display Name:{" "}
              <input
                type="text"
                name="displayName"
                id="displayName"
                value={signUp.displayName}
                onChange={onChangeHandlerSignup}
              />
            </label>
            <label htmlFor="password">
              Password:{" "}
              <input
                type="password"
                name="password"
                id="password"
                value={signUp.password}
                onChange={onChangeHandlerSignup}
              />
            </label>
            <button onClick={handleSignUpSubmit}>Submit</button>
          </>
        )}
      </section>
      <h1>OR</h1>
      <section>
        <h1>LOGIN AS</h1>
        <article></article>
        <article></article>
      </section>
    </div>
  );
};

export default HomePage;
