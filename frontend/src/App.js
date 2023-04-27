import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';

function App() {
  const socket = io('https://k8e202.p.ssafy.io', {
		cors: {
			origin: "*",
		}
	});

  console.log(socket);

  return (
    <div className="App">
    </div>
  );
}

export default App;
