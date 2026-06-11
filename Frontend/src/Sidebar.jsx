import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import { API } from "./api";

function Sidebar() {
    const {
        allThreads,
        setAllThreads,
        currThreadId,
        setNewChat,
        setPrompt,
        setReply,
        setCurrThreadId,
        setPrevChats,
        handleLogout
    } = useContext(MyContext);

    // 🔹 Fetch all threads
    const getAllThreads = async () => {
        try {
            const res = await API.get("/api/thread");

            const filteredData = res.data.map(thread => ({
                threadId: thread.threadId,
                title: thread.title,
            }));

            setAllThreads(filteredData);

        } catch (err) {
            console.error("Fetch threads failed:", err);
            if (err.response?.status === 401) {
                handleLogout();
            }
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    // 🔹 Create new chat
    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    // 🔹 Switch thread
    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const res = await API.get(`/api/thread/${newThreadId}`);
            console.log("Thread messages:", res.data);

            setPrevChats(res.data);
            setNewChat(false);
            setReply(null);

        } catch (err) {
            console.error("Change thread failed:", err);
            if (err.response?.status === 401) {
                handleLogout();
            }
        }
    };

    // 🔹 Delete thread
    const deleteThread = async (threadId) => {
        try {
            const res = await API.delete(`/api/thread/${threadId}`);
            console.log("Delete response:", res.data);

            // Update UI
            setAllThreads(prev =>
                prev.filter(thread => thread.threadId !== threadId)
            );

            if (threadId === currThreadId) {
                createNewChat();
            }

        } catch (err) {
            console.error("Delete thread failed:", err);
            if (err.response?.status === 401) {
                handleLogout();
            }
        }
    };

    return (
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img src="/logo.png" alt="gpt logo" className="logo" />
                <span>
                    <i className="fa-solid fa-pen-to-square"></i>
                </span>
            </button>

            <ul className="history">
                {allThreads?.map(thread => (
                    <li
                        key={thread.threadId}
                        onClick={() => changeThread(thread.threadId)}
                        className={
                            thread.threadId === currThreadId
                                ? "highlighted"
                                : ""
                        }
                    >
                        {thread.title}
                        <i
                            className="fa-solid fa-trash"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}
                        ></i>
                    </li>
                ))}
            </ul>

            <div className="sign">
                <p>By Harsh &hearts;</p>
            </div>
        </section>
    );
}

export default Sidebar;
