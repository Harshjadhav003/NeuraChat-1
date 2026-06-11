import { useState } from "react";
import { API } from "./api";

export default function Signup({ setAuthView }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await API.post("/auth/signup", {
        email,
        password,
      });

      alert("Signup successful. Please login.");

      // Signup nantar Login page open hoil
      setAuthView("login");

    } catch (err) {
      console.error("Signup Error:", err);
      alert(
        err.response?.data?.message ||
        "Signup failed - Check if backend is running"
      );
    }
  };

  return (
    <div className="authCard">
      <h2>Signup</h2>

      <input
        type="email"
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
        onClick={handleSignup}
        className="authBtn"
      >
        <i className="fa-solid fa-user-plus"></i>
        Signup
      </button>
    </div>
  );
}