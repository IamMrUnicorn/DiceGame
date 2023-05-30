import { useEffect, useState } from 'react'

const Players = ({player, socket}) => {
  const [players, setPlayers] = useState([])
  useEffect(() => {
    socket.on('players', (players) => {
      setPlayers(players)
    })
  })
  return (
    <div className='flex flex-col'>
      <p>you: {player.name} : {player.state}</p>
      {players.map((player, index)=> (
        <p key={index}>{player.name} | {player.state}</p>
      ))}
    </div>
  )
}

export default Players