import React, { useEffect, useState } from "react";

const WebsocketClient = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8081/ws");

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // // Cleanup on unmount
    // return () => {
    //   socket.close();
    // };
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Messages reçus :</h2>
      <ul className="list-disc pl-5">
        {messages.map((msg, index) => (
          <li key={index} className="mb-1">{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default WebsocketClient;
