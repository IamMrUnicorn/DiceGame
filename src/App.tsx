import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import './App.css';
import Players from './components/Players';
import DiceRoller from './components/DiceRoller';
import PrizePool from './components/PrizePool';
import PlayerChat from './components/PlayerChat';

export type Player = {
  name: string;
  state: string;
  wallet: number
};


const App = () => {

  const [player, setPlayer] = useState<Player | null>(null);
  const [typedName, setTypedName] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    if (player) {
      newSocket.emit('player', player);
    }

    return () => {
      newSocket.disconnect();
    };
  }, [player]);

  if (!player) {
    return (
      <div>
        <p>Enter your name</p>
        <input type="text" value={typedName} onChange={(e) => setTypedName(e.target.value)}></input>
        <button type="button" onClick={() => setPlayer({ name: typedName, state: 'watching', wallet:1000 })}>
          Enter
        </button>
      </div>
    );
  } else {
    return (
      <div className="flex-col">
        <p>Shoot some dice, {player.name}!</p>
        <div className="flex-row">
          <Players socket={socket}/>
          <DiceRoller player={player} socket={socket}/>
          <PrizePool player={player} setPlayer={setPlayer} socket={socket}/>
          <PlayerChat player={player} socket={socket}/>
        </div>
      </div>
    );
  }
};

export default App;
