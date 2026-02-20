import styles from "./homePage.module.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ItemContext } from "../ItemContext";
const apiUrl = import.meta.env.VITE_MESSAGING_APP_API_URL;

const HomePage = () => {
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  const [signUp, setSignUp] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });
  const [signIn, setSignIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const {
    setAuth,
    refreshAccount,
    refreshContacts,
    refreshExplorePeople,
    refreshMemberGroups,
    refreshExploreGroups,
    refreshAllProfiles,
  } = useContext(ItemContext);

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

  const navigate = useNavigate();

  const handleLoginSubmit = async (e, username, password) => {
    e.preventDefault();

    if (!username || !password) {
      return alert("You need to fill in all fields");
    }
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: `${username}`,
          password: `${password}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authorization", `Bearer ${data.token}`);
        setAuth(true);
        refreshAccount();
        refreshContacts();
        refreshExplorePeople();
        refreshMemberGroups();
        refreshExploreGroups();
        refreshAllProfiles();
        navigate("/account", { replace: false });
      } else if (response.status === 400) {
        const errorMessages = data.errors.map((err) => err.msg).join("\n");
        alert(`Format Error:\n${errorMessages}`);
      } else if (response.status === 401) {
        alert(data.error || "Login failed: Invalid credentials");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Connection to server failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (
      !signUp.username ||
      !signUp.password ||
      !signUp.displayName ||
      !signUp.confirmPassword
    ) {
      return alert("You need to fill in all the fields");
    }

    if (signUp.password !== signUp.confirmPassword) {
      return alert("Passwords do not match");
    }
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUp),
      });

      if (response.status === 200) {
        alert("Account created successfully!");
        localStorage.removeItem("authorization");
        setAuth(false);
        setSignIn(true);
        return;
      }

      const data = await response.json();

      if (response.status === 400 || response.status === 422) {
        if (data.errors) {
          const errorMessages = data.errors.map((err) => err.msg).join("\n");
          alert(`Validation Errors:\n${errorMessages}`);
        } else {
          alert(data.message || "Registration failed");
        }
      } else {
        alert("An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signIn}>
      <section>
        {signIn ? (
          <>
            <button onClick={() => setSignIn(false)} className={styles.switch}>
              Sign-Up Instead
            </button>
            <h1>Log-In</h1>
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
            <button
              onClick={(e) =>
                handleLoginSubmit(e, login.username, login.password)
              }
              className={styles.submit}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Submit"}
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setSignIn(true)} className={styles.switch}>
              Log-In Instead
            </button>
            <h1>Sign-Up</h1>
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
            <label htmlFor="confirmPassword">
              Confirm Password:{" "}
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={signUp.confirmPassword}
                onChange={onChangeHandlerSignup}
              />
            </label>
            <button
              onClick={handleSignUpSubmit}
              className={styles.submit}
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Submit"}
            </button>
          </>
        )}
      </section>
      <h1>OR</h1>
      <section className={styles.guest}>
        <h1>LOGIN AS</h1>
        <article
          onClick={(e) => handleLoginSubmit(e, "goku@gmail.com", "1234")}
        >
          <img src="/goku.jpeg" alt="Goku profile photo" />
          <h2>Goku</h2>
        </article>
        <article
          onClick={(e) => handleLoginSubmit(e, "vegeta@gmail.com", "1234")}
        >
          <img src="/vegeta.jpg" alt="Vegeta profile photo" />
          <h2>Vegeta</h2>
        </article>
      </section>
    </div>
  );
};

export default HomePage;
