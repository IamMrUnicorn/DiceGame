import { useState, useEffect } from 'react';

const PrizePool = ({ player, setPlayer, socket }) => {
  const [typedAmount, setTypedAmount] = useState('');
  const [prizePool, setPrizePool] = useState(0);
  const [brokeAlert, setBrokeAlert] = useState(false);

  useEffect(() => {
    socket.on('bet', (bet:number) => {
      setPrizePool((previousVal) => previousVal + bet);
    });

    return () => {
      socket.off('bet');
    };
  }, [socket]);

  const matchBet = () => {
    if (player.wallet >= prizePool) {
      setPlayer((prevVal) => ({
        ...prevVal,
        wallet:prevVal.wallet - prizePool
      }))
      socket.emit('bet', prizePool)
    }
  }

  const handleBet = () => {
    const amount = Number(typedAmount);

    if (player.wallet >= amount) {
      setPlayer((prevPlayer) => ({
        ...prevPlayer,
        wallet: prevPlayer.wallet - amount
      }));

      socket.emit('bet', amount);
      setPrizePool((previousVal) => previousVal + amount)
    } else if (player.wallet > 0 && amount > 0) {
      socket.emit('bet', player.wallet);
      setPrizePool((previousVal) => previousVal + amount)

      setPlayer((prevPlayer) => ({
        ...prevPlayer,
        wallet: 0
      }));
    } else {
      setBrokeAlert(true);
    }
  };

  return (
    <div>
      <p>Prize Pool: {prizePool}</p>
      <p>Your Wallet: {player.wallet}</p>
      {brokeAlert ? (
        <p>YOU ARE OUT OF MONEY</p>
      ) : (
        <div>
          <input
            type="text"
            value={typedAmount}
            onChange={(e) => setTypedAmount(e.target.value)}
          />
          <button onClick={handleBet}>Bet</button>
          <button onClick={matchBet}>match bet</button>
        </div>
      )}
    </div>
  );
};

export default PrizePool;
