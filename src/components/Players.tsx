import { useEffect, useState } from 'react'

const Players = ({player, socket}) => {
  const [players, setPlayers] = useState({})
  useEffect(() => {
    socket.on('players', (players) => {
      setPlayers(players)
    })
  })
  return (
    <div className='flex flex-col'>
      {Object.keys(players).map((playerName, index) => (<p key={index}>{playerName} | {players[playerName].state} ${players[playerName].wallet}</p>))}
    </div>
  )
}

export default Players