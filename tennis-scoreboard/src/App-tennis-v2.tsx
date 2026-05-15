import React, { useEffect, useState } from 'react';
import './App.css';

// TODO
// game score
// set score
// tiebreak mode
// undo

function App() {
  const [score1, setScore1] = useState<number>(0);
  const [score2, setScore2] = useState<number>(0);


  function handleScore1() {
    // 比赛结束就不能继续加了
    // 要考虑状态边界
    if (isGameOver) return;
    setScore1(s => s + 1);
  }

  function handleScore2() {
    if (isGameOver) return;
    setScore2(s => s + 1);
  }

  // 函数命名用getXXX更好，把setXX留给useState
  function setPayerScore(score: number) {
    switch (score) {
      case 0:
        // 直接return就不用break了
        return "Love";
      case 1:
        return "15";
      case 2:
        return "30";
      case 3:
        return "40";
      default:
        return "40";
    }


  }
  // 更精简的方式：
  //   function getPointLabel(score: number) {
  //   const labels = ["Love", "15", "30", "40"];
  //   return labels[score] ?? "40";
  // }



  function setCurrentCall(score1: number, score2: number) {
    // deuce之后的
    if (score1 >= 3 && score2 >= 3) {
      if (score1 === score2) return "Deuce";

      if (score1 === score2 + 1) return "Advantage A";
      if (score2 === score1 + 1) return "Advantage B";

      //  这在你当前逻辑下没问题。
      // 但从表达意图来说，网球赢球的条件更准确是“至少领先2分”。
      // 所以通常我会更喜欢写成：一眼就知道你在表达“领先两分
      // if (score1 >= score2 + 2) return "A wins";
      // if (score2 >= score1 + 2) return "B wins";
      if (score1 > score2 + 1) return "A wins";
      if (score2 > score1 + 1) return "B wins";

      // if (score1 >= 4 && score1 === score2 + 1) return "Advantage A";
      // if (score2 >= 4 && score2 === score1 + 1) return "Advantage B";

      // if (score1 >= 5 && score1 > score2 + 1) return "A wins";
      // if (score2 >= 5 && score2 > score1 + 1) return "B wins";
    }


    // 没到deuce就赢的  
    if (score1 >= 4 && score1 >= score2 + 2) return "A wins";
    if (score2 >= 4 && score2 >= score1 + 2) return "B wins";

    return `${setPayerScore(score1)}-${setPayerScore(score2)}`



  }

  function handleReset() {
    setScore1(0);
    setScore2(0);
  }

  const call1 = setPayerScore(score1);
  const call2 = setPayerScore(score2);
  const currentCall = setCurrentCall(score1, score2)
  const isGameOver = currentCall === "A wins" || currentCall === "B wins";
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <h3>Tennis Scoreboard</h3>
      <h4>Set1~Mode:Normarl Game</h4>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem", }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "2rem", }}>
          <h4>Player A</h4>
          <div className='board'>
            <h2>{call1}</h2>
            {/* <h2>{score1}</h2> */}
          </div>
          <button onClick={handleScore1}>Score</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "2rem", }}>
          <h4>Player B</h4>
          <div className='board'>
            <h2>{call2}</h2>
            {/* <h2>{score2}</h2> */}
          </div>
          <button onClick={handleScore2}>Score</button>
        </div>

      </div>

      <h2> Current Call:{currentCall}</h2>
      <button onClick={handleReset}>Reset</button>
    </div >
  );
}

export default App;
