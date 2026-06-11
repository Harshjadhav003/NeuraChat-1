import "./App.css";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import Login from "./Login";
import Signup from "./Signup";
import { MyContext } from "./MyContext";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

function App() {
  const [authView, setAuthView] = useState(null); // null means landing page
  const [isOpen, setIsOpen] = useState(false);

  const [user, setUser] = useState(
    localStorage.getItem("token")
  );

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsOpen(false);
    setAuthView(null);
    
    // Reset chat states for the next user
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
    setNewChat(true);
    setAllThreads([]);
  };

  const handleProfileClick = () => {
    setIsOpen((prev) => !prev);
  };

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
    allThreads,
    setAllThreads,
    user,
    setUser,
    handleLogout,
  };

  return (
    <MyContext.Provider value={providerValues}>
      <div className="mainLayout">
        <div className="navbar">
          <span onClick={() => !user && setAuthView(null)} style={{ cursor: !user ? 'pointer' : 'default' }}>
            NeuraTeck <i className="fa-solid fa-chevron-down"></i>
          </span>
          {user && (
            <div className="userIconDiv" onClick={handleProfileClick}>
              <span className="userIcon">
                <i className="fa-solid fa-user"></i>
              </span>
            </div>
          )}
        </div>

        {isOpen && user && (
          <div className="dropDown">
            <div className="dropDownItem" onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
            </div>
          </div>
        )}

        {!user ? (
          <div className="authContainer">
            {!authView ? (
              <div className="landingPage">
                <h1>Welcome to NeuraTeck</h1>
                <p>Log in with your account to continue</p>
                <div className="landingBtns">
                  <button className="authBtn" onClick={() => setAuthView("login")}>
                    <i className="fa-solid fa-right-to-bracket"></i> Log in
                  </button>
                  <button className="authBtn" onClick={() => setAuthView("signup")}>
                    <i className="fa-solid fa-user-plus"></i> Sign up
                  </button>
                </div>
              </div>
            ) : (
              <>
                {authView === "login" && <Login />}
                {authView === "signup" && <Signup setAuthView={setAuthView} />}
                
                <button
                  className="toggleBtn"
                  onClick={() => setAuthView(authView === "login" ? "signup" : "login")}
                >
                  {authView === "login"
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Log in"}
                </button>
                
                <button className="toggleBtn" onClick={() => setAuthView(null)}>
                  ← Back to welcome page
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="app">
            <Sidebar />
            <ChatWindow />
          </div>
        )}
      </div>
    </MyContext.Provider>
  );
}

export default App;