import { useState, useEffect } from 'react';

const PrizePool = ({ player, setPlayer, socket }) => {
  const [typedAmount, setTypedAmount] = useState('');
  const [prizePool, setPrizePool] = useState(0);
  const [brokeAlert, setBrokeAlert] = useState(false);
  const [betPlaced, setBetPlaced] = useState(false);

  useEffect(() => {
    socket.on('bet', (bet: number) => {
      if (bet === 0) {
        setPrizePool(0)
        setBetPlaced(false)
      } else {
        setPrizePool((previousVal) => previousVal + bet);
      }
    });

    socket.on('winner', (prizePool:number) => {
      setPlayer((prevVal) => ({
        ...prevVal,
        state:'player1',
        wallet: prevVal.wallet + prizePool
      }))
    })

    socket.on('loser', () => {
      setPlayer((prevVal) => ({
        ...prevVal,
        state: 'watching'
      }))
    })

    socket.on('prizeMoney', (winningTicket) => {
      console.log(winningTicket)
      if (player.name === winningTicket.winner) {
        console.log('wow i just saved myself 150 bucks!')
        setPlayer((prevVal) => ({
          ...prevVal,
          wallet: prevVal + winningTicket.prize
        }))
      }
    })

    socket.on('gameStart', () => {
      setBetPlaced(true)
    })

    return () => {
      socket.off('bet');
    };
  }, [socket, betPlaced]);

  const matchBet = () => {
    if (player.wallet >= prizePool) {
      setPlayer((prevVal) => ({
        ...prevVal,
        state: 'player2',
        wallet: prevVal.wallet - prizePool
      }))
      setBetPlaced(true)
      socket.emit('bet', prizePool)
      socket.emit('gameStart')
    }
  }

  // const doubleBet = () => {
  //   if (player.wallet >= (prizePool * 2)) {
  //     setPlayer((prevVal) => ({
  //       ...prevVal,
  //       state:'player1',
  //       wallet:prevVal.wallet - (prizePool * 2)
  //     }))
  //     setBetPlaced(true)
  //     socket.emit('bet', (prizePool * 2))
  //     setPrizePool((previousVal) => previousVal * 2)
  //   }
  // }

  const handleInitalBet = () => {
    const amount = Number(typedAmount);

    if (player.wallet >= amount) {
      setPlayer((prevPlayer) => ({
        ...prevPlayer,
        state: 'player1',
        wallet: prevPlayer.wallet - amount
      }));

      socket.emit('bet', amount);
      setBetPlaced(true)
      setPrizePool((previousVal) => previousVal + amount)

    } else if (player.wallet > 0 && amount > 0) {
      socket.emit('bet', player.wallet);
      setPrizePool((previousVal) => previousVal + amount)
      setBetPlaced(true)
      setPlayer((prevPlayer) => ({
        ...prevPlayer,
        state: 'player1',
        wallet: 0
      }));
    } else {
      setBrokeAlert(true);
    }
    setTypedAmount('')
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
                  <button onClick={handleInitalBet}>place inital bet</button>
                </div>
              ) : (
                <div>
                  <button onClick={matchBet}>match bet</button>
                  {/* <button onClick={doubleBet}>double bet</button> */}
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
