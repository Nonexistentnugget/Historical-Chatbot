import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Avatar from "./components/Profile_pic.jsx";
import profilePic from "./assets/Norton_profile_pic.jpg";

export default function App() {
  // Contains the history of the convo as an array of msg objects
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Speak." }
  ]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [nortonDollars, setNortonDollars] = useState(0);
  const [imperialFavour, setImperialFavour] = useState(50); // currently, i've just set it to 50 by default
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!userName.trim()) return;
    setIsNameSet(true);
    inputRef.current?.focus();
  };

  const displayName = userName.trim() || "Citizen";

  const getEmperorMood = () => {
    if (imperialFavour >= 80) return "Delighted";
    if (imperialFavour >= 50) return "Pleased";
    if (imperialFavour >= 25) return "Indifferent";
    return "Displeased";
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!input.trim() || isTyping) return;

    if (!isNameSet && userName.trim()) {
      setIsNameSet(true);
    }

    const currentInput = input;
    const currentSpeaker = displayName;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: currentInput
    };

    setMessages((prev) => [...prev, userMessage]);
    setNortonDollars((prev) => prev + 10);

    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: currentInput,
          userName: currentSpeaker,
          imperialFavour: imperialFavour
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      // display the actual backend response
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: data.reply
        }
      ]);

      // update Imperial favour
      if (data.imperialFavour !== undefined) {
        setImperialFavour(data.imperialFavour);
      }
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "I beg your pardon? try again" // if you're seeing this, it's likely you're forgetting to start the backend
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    setMessages([{ id: Date.now(), sender: "bot", text: "Speak." }]);
    setNortonDollars(0);
    setImperialFavour(50);
    inputRef.current?.focus();
  };

  return (
    <div className="main_container">
      <div className="chat-container">
        <header className="chat-header">
          <h1>Speak to Emperor Norton</h1>
          <button onClick={handleClear} className="clear-btn" title="Reset Chat">
            Reset
          </button>
        </header>

        <div className="stats-bar">
          {/* points display */}
          <div className="dollars-display">
            <strong>Norton Dollars:</strong> ${nortonDollars}
          </div>

          <div className="favour-display">
            <span>
              <strong>Imperial Favour:</strong> {getEmperorMood()} ({imperialFavour}%)
            </span>
            {/* outline of the bar */}
            <div className="favour-bar-track">
              {/* interior of the bar */}
              <div
                className="favour-bar-fill"
                style={{ width: `${imperialFavour}%` }}
              />
            </div>
          </div>
        </div>

        {!isNameSet ? (
          <form onSubmit={handleNameSubmit} className="name-bar">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="State your name, Citizen..."
              maxLength={24}
            />
            <button type="submit">Declare</button>
          </form>
        ) : (
          <div className="name-status">
            <span>
              Speaking as: <strong>{displayName}</strong>
            </span>
            <button onClick={() => setIsNameSet(false)} className="edit-name-btn">
              Change
            </button>
          </div>
        )}

        {/* Main chat area */}
        <div className="chat-window">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-row ${msg.sender}`}>
            {/* rendering Norton's profile picture beside each bot message, for that messaging app aesthetic */}
              {msg.sender === "bot" && (
                <div className="msg-avatar">
                  <Avatar src={profilePic} />
                </div>
              )}
              <div className="message-group">
                <span className="sender-tag">
                  {msg.sender === "bot" ? "Emperor Norton I" : displayName}
                </span>
                <div className="message-bubble">{msg.text}</div>
              </div>
            </div>
          ))}

          {/* '...' as norton types */}
          {isTyping && (
            <div className="message-row bot">
              <div className="msg-avatar">
                <Avatar src={profilePic} />
              </div>
              <div className="message-group">
                <span className="sender-tag">Emperor Norton I</span>
                <div className="message-bubble typing-bubble">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* bottom text input and the send button (disabled when the bot is typing) */}
        <form onSubmit={handleSend} className="input-area">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Speak to Norton..."
            disabled={isTyping}
          />
          <button type="submit" disabled={isTyping}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
