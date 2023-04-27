import logo from "./logo.svg";
import "./App.css";
import { io } from "socket.io-client";
import { useState } from "react";

function App() {
    var socket = io('https://k8e202.p.ssafy.io');

    const [text, setText] = useState("");

    console.log(socket);

    var messages = document.getElementById("messages");
    var form = document.getElementById("form");
    var input = document.getElementById("input");

    // form.addEventListener("submit", function (e) {
    //     e.preventDefault();
    //     if (input.value) {
    //         socket.emit("chat message", input.value);
    //         input.value = "";
    //     }
    // });

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
                    e.preventDefault();
                    if (input.value) {
                        console.log(socket);
                        socket.emit("chat message", input.value);
                        input.value = "";
                    }
                }}
            >
                Send
            </button>
        </div>
    );
}

export default App;