import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3000"; // API Gateway base URL

function App() {
  const [authToken, setAuthToken] = useState("");
  const [userId, setUserId] = useState("");
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [profile, setProfile] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatResponse, setChatResponse] = useState("");

  // Register user
  const handleRegister = async () => {
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, registerData);
      alert("Registered userId: " + res.data.userId);
    } catch (err) {
      alert("Register error: " + (err.response?.data?.message || err.message));
    }
  };

  // Login user
  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, loginData);
      setAuthToken(res.data.token);
      alert("Login successful");
    } catch (err) {
      alert("Login error: " + (err.response?.data?.message || err.message));
    }
  };

  // Get user profile
  const fetchProfile = async () => {
    if (!authToken || !userId) {
      alert("Set userId and login first");
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/users/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setProfile(res.data);
    } catch (err) {
      alert("Fetch profile error: " + (err.response?.data?.message || err.message));
    }
  };

  // List colleges
  const fetchColleges = async () => {
    try {
      const res = await axios.get(`${API_BASE}/colleges`);
      setColleges(res.data);
    } catch (err) {
      alert("Fetch colleges error: " + (err.response?.data?.message || err.message));
    }
  };

  // Send chat message
  const sendChatMessage = async () => {
    if (!authToken) {
      alert("Login first");
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE}/chat/message`,
        { userId, message: chatMessage },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setChatResponse(res.data.reply);
    } catch (err) {
      alert("Chat error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admission Jockey Microservices Test Frontend</h1>

      <section>
        <h2>Auth Service</h2>
        <div>
          <h3>Register</h3>
          <input
            placeholder="Name"
            value={registerData.name}
            onChange={(e) =>
              setRegisterData({ ...registerData, name: e.target.value })
            }
          />
          <input
            placeholder="Email"
            value={registerData.email}
            onChange={(e) =>
              setRegisterData({ ...registerData, email: e.target.value })
            }
          />
          <input
            placeholder="Password"
            type="password"
            value={registerData.password}
            onChange={(e) =>
              setRegisterData({ ...registerData, password: e.target.value })
            }
          />
          <button onClick={handleRegister}>Register</button>
        </div>

        <div>
          <h3>Login</h3>
          <input
            placeholder="Email"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          />
          <input
            placeholder="Password"
            type="password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      </section>

      <section>
        <h2>User Service</h2>
        <input
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={fetchProfile}>Get Profile</button>
        {profile && (
          <pre style={{ background: "#eee", padding: 10 }}>
            {JSON.stringify(profile, null, 2)}
          </pre>
        )}
      </section>

      <section>
        <h2>College Service</h2>
        <button onClick={fetchColleges}>List Colleges</button>
        {colleges.length > 0 && (
          <ul>
            {colleges.map((c) => (
              <li key={c.collegeId}>
                {c.name} - {c.state}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Chatbot Gateway</h2>
        <input
          placeholder="Chat message"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
        />
        <button onClick={sendChatMessage}>Send Message</button>
        {chatResponse && (
          <p>
            <strong>Response:</strong> {chatResponse}
          </p>
        )}
      </section>
    </div>
  );
}

export default App;
