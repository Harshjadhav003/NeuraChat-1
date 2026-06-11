import { useState, useContext } from "react";
import { API } from "./api";
import { MyContext } from "./MyContext";

export default function Login() {
  const { setUser } = useContext(MyContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async () => {
  try {
    const res = await API.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem(
      "token",
      res.data.token
    );

    setUser(res.data.token);

    alert("Login successful");

  } catch (err) {
    console.error("Login Error:", err);
    alert(
      err.response?.data?.message ||
      "Login failed - Check if backend is running"
    );
  }
};

  return (
    <div className="authCard">
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button
        onClick={handleLogin}
        className="authBtn"
      >
        <i className="fa-solid fa-right-to-bracket"></i>
        Login
      </button>
    </div>
  );
}