import { useEffect, useState } from 'react';
import { Player } from '../App';

type Players = {
  [key: string]: Player;
};

interface PlayersProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any;
}

const Players = ({ socket }: PlayersProps) => {
  const [players, setPlayers] = useState<Players>({});

  useEffect(() => {
    socket.on('players', (players: Players) => {
      setPlayers(players);
    });
  }, [socket]);

  return (
    <div className='flex flex-col'>
      {Object.keys(players).map((playerName) => (
        <p key={playerName}>
          {playerName} | {players[playerName].state} ${players[playerName].wallet}
        </p>
      ))}
    </div>
  );
};

export default Players;
