import { useState, useEffect } from 'react';
import { Player } from '../App';

const PrizePool = ({ player, setPlayer, socket }: { player: Player; setPlayer: any; socket: Socket }) => {
  const [typedAmount, setTypedAmount] = useState('');
  const [prizePool, setPrizePool] = useState(0);
  const [brokeAlert, setBrokeAlert] = useState(false);
  const [betPlaced, setBetPlaced] = useState(false);

  useEffect(() => {
    const resetPoolHandler = () => {
      setPrizePool(0);
      setBetPlaced(false);
    };

    const prizePoolHandler = (prize: number) => {
      setPrizePool(prize);
    };

    const winnerHandler = (prizePool: number) => {
      setPlayer((prevVal: Player) => ({
        ...prevVal,
        state: 'player1',
        wallet: prevVal.wallet + prizePool,
      }));
    };

    const loserHandler = () => {
      setPlayer((prevVal: Player) => ({
        ...prevVal,
        state: 'watching',
      }));
    };

    const prizeMoneyHandler = (winningTicket: { winner: string; prize: number }) => {
      console.log(winningTicket);
      if (player.name === winningTicket.winner) {
        setPlayer((prevVal: Player) => ({
          ...prevVal,
          state: 'player1',
          wallet: prevVal.wallet + winningTicket.prize,
        }));
      } else {
        setPlayer((prevVal: Player) => ({
          ...prevVal,
          state: 'watching',
        }));
      }
    };

    const startHandler = () => {
      setBetPlaced(true);
    };

    socket.on('reset pool', resetPoolHandler);
    socket.on('prize pool', prizePoolHandler);
    socket.on('winner', winnerHandler);
    socket.on('loser', loserHandler);
    socket.on('prizeMoney', prizeMoneyHandler);
    socket.on('start', startHandler);

    return () => {
      socket.off('bet', () => {
        console.log('h');
      });
      socket.off('reset pool', resetPoolHandler);
      socket.off('prize pool', prizePoolHandler);
      socket.off('winner', winnerHandler);
      socket.off('loser', loserHandler);
      socket.off('prizeMoney', prizeMoneyHandler);
      socket.off('start', startHandler);
    };
  }, [socket, player, setPlayer]);

  const matchBet = () => {
    if (player.wallet >= prizePool) {
      setPlayer((prevVal: Player) => ({
        ...prevVal,
        state: 'player2',
        wallet: prevVal.wallet - prizePool,
      }));
      setBetPlaced(true);
      socket.emit('bet', prizePool);
      socket.emit('start');
    }
  };

  const handleInitalBet = () => {
    const amount = Number(typedAmount);

    if (amount <= 0) {
      setTypedAmount('');
      return;
    }

    if (player.wallet >= amount) {
      setPlayer((prevPlayer: Player) => ({
        ...prevPlayer,
        state: 'player1',
        wallet: prevPlayer.wallet - amount,
      }));

      socket.emit('bet', amount);
      setBetPlaced(true);
      setTypedAmount('');
      return
    } else {
      setTypedAmount('');
      return
    }
  };

  return (
    <div>
      <p>Prize Pool: ${prizePool}</p>
      <p>Your Wallet: ${player.wallet}</p>
      {betPlaced ? (
        <p>bet placed already or game started</p>
      ) : (
        <div>
          {brokeAlert ? (
            <p>YOU ARE OUT OF MONEY</p>
          ) : (
            <div>
              {prizePool === 0 ? (
                <div>
                  <input type="text" value={typedAmount} onChange={(e) => setTypedAmount(e.target.value)} />
                  <button onClick={handleInitalBet}>place initial bet</button>
                </div>
              ) : (
                <div>
                  <button onClick={matchBet}>match bet</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PrizePool;
