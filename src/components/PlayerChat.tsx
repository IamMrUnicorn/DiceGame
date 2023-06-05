import { useEffect, useState } from 'react';
import { Player } from '../App';

/*
    make a king of the hill betting priority que,
    first in que will be winner
    second in que will be null until another player bets into that slot
    all other players will be in subsequent slots in que
    if the winner loses then they will drop down past the second slot in the que
      and the second player rises to the first slot 
      and the second slot is returne to null
  */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PlayerChat = ({ player, socket }: { player: Player; socket: any }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [rolls, setRolls] = useState<string[]>([]);

  useEffect(() => {
    const handleChatMessage = (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    };
    const handleRollMessage = (roll: string) => {
      console.log(roll)
      setRolls((prevRolls) => [...prevRolls, roll]);
    };

    socket.on('chat message', handleChatMessage);
    socket.on('diceRoll', handleRollMessage);
    socket.on('yourNumber', handleRollMessage);

    return () => {
      socket.off('chat message', handleChatMessage);
      socket.off('diceRoll', handleRollMessage);
    };
  }, [socket]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = document.getElementById('input') as HTMLInputElement;
    const message = input.value.trim();

    if (message) {
      socket?.emit('chat message', `${player.name} : ${message}`);
      input.value = '';
    }
  };
  return (
    <div>
      <div className="chat">
        <p>chat</p>
        <ul id="messages">
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
        <form id="form" onSubmit={handleSubmit}>
          <input id="input" autoComplete="off" />
          <button type="submit">Send</button>
        </form>
      </div>
      
      <p>rolls</p>
      <div className="roll-chat">
        <ul id="rolls">
          {rolls.map((roll, index) => (
            <li key={index}>{roll}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlayerChat;


