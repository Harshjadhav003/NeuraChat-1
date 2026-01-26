import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
    const {
        allThreads,
        setAllThreads,
        currThreadId,
        setNewChat,
        setPrompt,
        setReply,
        setCurrThreadId,
        setPrevChats
    } = useContext(MyContext);

    // 🔹 Fetch all threads
    const getAllThreads = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/thread`
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Thread list error:", errorText);
                return;
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                console.error("Invalid thread list format:", data);
                return;
            }

            const filteredData = data.map(thread => ({
                threadId: thread.threadId,
                title: thread.title,
            }));

            setAllThreads(filteredData);

        } catch (err) {
            console.error("Fetch threads failed:", err);
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
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/thread/${newThreadId}`
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Thread fetch error:", errorText);
                return;
            }

            const data = await response.json();
            console.log("Thread messages:", data);

            if (!Array.isArray(data)) {
                console.error("Invalid messages format:", data);
                return;
            }

            setPrevChats(data);
            setNewChat(false);
            setReply(null);

        } catch (err) {
            console.error("Change thread failed:", err);
        }
    };

    // 🔹 Delete thread
    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/thread/${threadId}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Delete thread error:", errorText);
                return;
            }

            const data = await response.json();
            console.log("Delete response:", data);

            // Update UI
            setAllThreads(prev =>
                prev.filter(thread => thread.threadId !== threadId)
            );

            if (threadId === currThreadId) {
                createNewChat();
            }

        } catch (err) {
            console.error("Delete thread failed:", err);
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
