import { useState, useEffect, useRef } from "react";
import chatStyles from "./Chat.module.css";
import { config } from "../../../../config";

type Msg = { sender: "user" | "ai"; text: string };

export default function Chat() {
  const [userInput, setUserInput] = useState("");
  const [userInputTone, setUserInputTone] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { sender: "ai", text: "הדבק כאן את הטקסט שברצונך לשפר ותקבל הצעות לייעול." },
  ]);

  const messagesRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    const el = messagesRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim() || isSending) return;

    setMessages((prev) => [...prev, { sender: "user", text: userInput }]);

    const input = userInput;
    const tone = userInputTone;

    setUserInput("");
    setUserInputTone("");
    setIsSending(true);

    try {
      const response = await fetch(
        `${config.apiUrl}/landing-page-generator/getTextSuggestions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: input, tone }),
        }
      );

      let suggestionText = "אין הצעות זמינות.";
      try {
        const data = await response.json();
        if (Array.isArray(data?.suggestion) && data.suggestion.length) {
          const texts = data.suggestion
            .map((v: any) => (v && typeof v.text === "string" ? v.text.trim() : ""))
            .filter((t: string) => t);
          if (texts.length) suggestionText = texts.join("\n\n");
        } else if (Array.isArray(data?.suggestions) && data.suggestions.length) {
          const texts = data.suggestions
            .map((v: any) => (v && typeof v.text === "string" ? v.text.trim() : ""))
            .filter((t: string) => t);
          if (texts.length) suggestionText = texts.join("\n\n");
        } else if (typeof data?.suggestion === "string" && data.suggestion.trim()) {
          suggestionText = data.suggestion.trim();
        }
      } catch {}

      setMessages((prev) => [...prev, { sender: "ai", text: suggestionText }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "אירעה שגיאה בהצגת ההצעות." },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={chatStyles.chatContainer}>
      <div className={chatStyles.messages} ref={messagesRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.sender === "user" ? chatStyles.userMessage : chatStyles.aiMessage}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className={chatStyles.inputContainer}>
        <input
          type="text"
          placeholder="העתק/הדבק כאן את הטקסט לשינוי..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={chatStyles.input}
        />
        <input
          type="text"
          placeholder="דרישות מיוחדות להצעות..."
          value={userInputTone}
          onChange={(e) => setUserInputTone(e.target.value)}
          onKeyDown={handleKeyDown}
          className={chatStyles.input}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={isSending}
          className={chatStyles.sendButton}
        >
          {isSending ? "שולח..." : "שלח"}
        </button>
      </div>
    </div>
  );
}
