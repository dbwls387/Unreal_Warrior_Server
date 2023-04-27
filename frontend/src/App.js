import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';

function App() {
  const socket = io('https://k8e202.p.ssafy.io', {
		cors: {
			origin: "*",
		}
	});

  socket.on('test', socket => {
		console.log(socket);
	});

  const handleRequestSocket = () => {
    console.log(socket);
		socket.emit("test", {
			data: 'test socket on client'
		});
	};
	
	function handleChange() {
		console.log('change handle');
	};

  return (
    <div className="App">
      test socket connection
			<button onClick={ handleRequestSocket }>Request</button>
			<input type="text" onChange={ handleChange } />
    </div>
  );
}

export default App;
