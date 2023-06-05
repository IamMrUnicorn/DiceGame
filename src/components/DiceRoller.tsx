import {useState, useEffect} from 'react'
import {Player} from '../App'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
const DiceRoller = ({player, socket} : { player: Player; socket: any }) => {

  const [dice1, setDice1] = useState<{ value: number; rolled: boolean }>({ value: 0, rolled: false })
  const [dice2, setDice2] = useState<{ value: number; rolled: boolean }>({ value: 0, rolled: false })
  const [diceTotal, setDiceTotal] = useState(0)
  const [lastRoll, setLastRoll] = useState(0)
  const [yourNumber, setYourNumber] = useState(0)
  
  useEffect(() => {

    const resetDice = () => {
      setLastRoll(diceTotal)
      setDiceTotal(0)
      setDice1({
        value:0,
        rolled:false
      })
      setDice2({
        value:0,
        rolled:false
      })
      return
    }
    //if this is the first roll
    if ((dice1.rolled && dice2.rolled) && yourNumber === 0) {
      //if that first roll is a 7 or an 11, player wins prize pool
      if (diceTotal === 7 || diceTotal === 11) {
        resetDice()
        setYourNumber(0)
        socket.emit('winner')
      } else {
        setYourNumber(diceTotal)
        socket.emit('yourNumber', diceTotal)
        resetDice()
    }
      //else if this roll is not 7, 11, or yourNumber, reset dice and keep rolling
    } else if ((dice1.rolled && dice2.rolled) && (diceTotal !== yourNumber && diceTotal !== 7 && diceTotal !== 11)) {
      resetDice()
      //else if this roll is yourNumber reset dice and reset yourNumber and make this player the winner
    } else if ((dice1.rolled && dice2.rolled) && (diceTotal === yourNumber)) {
      resetDice()
      setYourNumber(0)
      socket.emit('winner')
      setYourNumber(0)

      //else if this roll is 7 or 11, reset the dice, make this player the loser
    } else if ((dice1.rolled && dice2.rolled) && (diceTotal === 7 || diceTotal === 11)) {
      resetDice()
      socket.emit('loser')
      setYourNumber(0)
    }
  }, [dice1.rolled, dice2.rolled, diceTotal, yourNumber, socket])

  const rollDice = (option:number) => {
    if (option === 1) {
      const randomNum = Math.floor(Math.random() * (7 - 1) + 1)
      setDice1({
        value:randomNum,
        rolled:true
      })
      setDiceTotal((prev) => (prev + randomNum))
      socket.emit('diceRoll', randomNum)

    } else if (option === 2) { 
      const randomNum = Math.floor(Math.random() * (7 - 1) + 1)
      setDice2({
        value:randomNum,
        rolled:true
      })
      setDiceTotal((prev) => (prev + randomNum))
      socket.emit('diceRoll', randomNum)

    } else if (option === 3) {
      const randomNum = Math.floor(Math.random() * (7 - 1) + 1)
      const randomNum2 = Math.floor(Math.random() * (7 - 1) + 1)
      setDice1({
        value:randomNum,
        rolled:true
      })
      setDice2({
        value:randomNum2,
        rolled:true
      })
      setDiceTotal(randomNum + randomNum2)
      socket.emit('diceRoll', randomNum)
      socket.emit('diceRoll', randomNum2)
    }
    return
  }

  return (
    <div className='flex flex-col'>
      <p>dice total: {diceTotal}</p>
      <p>last roll: {lastRoll}</p>
      <p>your number: {yourNumber}</p>
      {player.state === 'player1' ? <div className='flex flex-row'>
        {dice1.rolled === false ? <button onClick={() => {rollDice(1)}}>roll dice1</button> : <button>{dice1.value}</button>}
        {dice2.rolled === false ? <button onClick={() => {rollDice(2)}}>roll dice2</button> : <button>{dice2.value}</button>}
        {dice1.rolled === false && dice2.rolled === false ? <button onClick={() => {rollDice(3)}}>roll dice pair</button> : <button>{diceTotal}</button>}
      </div> : <div className='flex flex-row'>
        <button>Not Your Turn</button>
        <button>Not Your Turn</button>
        <button>Not Your Turn</button>
      </div>}
    </div>
  )
}

export default DiceRoller