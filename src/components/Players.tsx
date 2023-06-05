import { useEffect, useState } from 'react'
import { Player } from '../App'

const Players = ({socket}) => {
  const [players, setPlayers] = useState({})
  useEffect(() => {
    socket.on('players', (players:Player) => {
      setPlayers(players)
    })
  })
  return (
    <div className='flex flex-col'>
      {Object.keys(players).map((playerName) => (<p key={playerName}>{playerName} | {players[playerName].state} ${players[playerName].wallet}</p>))}
    </div>
  )
}

export default Players