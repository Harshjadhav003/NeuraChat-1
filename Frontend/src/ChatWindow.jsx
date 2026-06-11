import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { API } from "./api";

function ChatWindow() {
    const {
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        setPrevChats,
        setNewChat,
        handleLogout
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);

    const getReply = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setNewChat(false);

        console.log("message:", prompt, "threadId:", currThreadId);

        try {
            const res = await API.post("/api/chat", {
                message: prompt,
                threadId: currThreadId,
            });

            if (res.data?.reply) {
                setReply(res.data.reply);
            } else {
                console.error("Invalid response format:", res.data);
            }

        } catch (err) {
            console.error("Fetch error:", err);
            if (err.response?.status === 401) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    // Append new chat to previous chats
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prev => [
                ...prev,
                { role: "user", content: prompt },
                { role: "assistant", content: reply },
            ]);
        }
        setPrompt("");
    }, [reply]);

    return (
        <div className="chatWindow">
            <Chat />

            <ScaleLoader loading={loading} color="#fff" />

            <div className="chatInput">
                <div className="inputBox">
                    <input
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && getReply()}
                    />
                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>

                <p className="info">
                    NeuraChat can make mistakes. Check important info.
                </p>
            </div>
        </div>
    );
}

export default ChatWindow;
