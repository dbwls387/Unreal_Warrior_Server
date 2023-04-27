import logo from './logo.svg';
import './App.css';
import { io } from "socket.io-client";

function App() {	

    var socket = io();

      console.log(socket);

      var messages = document.getElementById('messages');
      var form = document.getElementById('form');
      var input = document.getElementById('input');

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (input.value) {
          socket.emit('chat message', input.value);
          input.value = '';
        }
      });

      socket.on('chat message', function(msg) {
        var item = document.createElement('li');
        item.textContent = msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
      });
  return (
    <div className="App">
      <ul id="messages"></ul>
      <form id="form" action="">
        <input id="input" autocomplete="off" /><button>Send</button>
      </form>

    </div>
  );
}

export default App;
