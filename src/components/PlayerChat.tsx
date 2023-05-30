import { useEffect, useState } from 'react';

type Player = {
  name: string;
  state: string;
};

/*
    make a king of the hill betting priority que,
    first in que will be winner
    second in que will be null until another player bets into that slot
    all other players will be in subsequent slots in que
    if the winner loses then they will drop down past the second slot in the que
      and the second player rises to the first slot 
      and the second slot is returne to null
  */

const PlayerChat = ({ player, socket }: { player: Player; socket: any }) => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const handleChatMessage = (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    socket.on('chat message', handleChatMessage);

    return () => {
      socket.off('chat message', handleChatMessage);
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
    <div className="chat">
      <ul id="messages">
        {messages.map(({msg}, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <form id="form" onSubmit={handleSubmit}>
        <input id="input" autoComplete="off" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default PlayerChat;
