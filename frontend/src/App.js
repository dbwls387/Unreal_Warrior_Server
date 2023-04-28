import logo from "./logo.svg";
import "./App.css";
import { io } from "socket.io-client";
import { useState } from "react";

function App() {
    var socket = io("https://k8e202.p.ssafy.io", {
        path: "/socket.io",
    });
    console.log(socket);

    const [text, setText] = useState("");

    var messages = document.getElementById("messages");
    var input = document.getElementById("input");

    socket.on("chat message", function (msg) {
        console.log(msg);
        var item = document.createElement("li");
        item.textContent = msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });

    return (
        <div className="App">
            <ul id="messages"></ul>
            <input
                id="input"
                autocomplete="off"
                onChange={(e) => {
                    setText(e.target.value);
                }}
            />
            <button
                onClick={(e) => {
                    console.log(text);

                    e.preventDefault();
                    if (text) {
                        socket.emit("chat message", text);
                        setText("");
                    }
                }}
            >
                Send
            </button>
        </div>
    );
}

export default App;
