import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import './App.css';
import Players from './components/Players';
import DiceRoller from './components/DiceRoller';
import PrizePool from './components/PrizePool';
import PlayerChat from './components/PlayerChat';

type Player = {
  name: string;
  state: string;
  wallet: number
};

//when game starts everyone starts with 1000$ 
//the first person to place a bet becomes player1, 
//then the next person to match that bet becomes player2
//after the money is deducted from each players wallet
//then player1's state changes to playerRolling
//depending on what happens in the rolls, player1 will keep winning lose or keep rolling
//on the event that player1 loses, player2 should collect the prize pool and become winnerWaiting
//on the event that player1 wins, player 2 should 
const App = () => {
  //player states = WinnerWaiting, PlayerBetting, PlayerRolling, PlayerWatching, loser, 
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
        <button type="button" onClick={() => setPlayer({ name: typedName, state: 'PlayerWatching', wallet:1000 })}>
          Enter
        </button>
      </div>
    );
  } else {
    return (
      <div className="flex-col">
        <p>Shoot some dice</p>
        <div className="flex-row">
          <Players player={player} socket={socket}/>
          <DiceRoller player={player} setPlayer={setPlayer} socket={socket}/>
          <PrizePool player={player} setPlayer={setPlayer} socket={socket}/>
          <PlayerChat player={player} socket={socket}/>
        </div>
      </div>
    );
  }
};

export default App;
