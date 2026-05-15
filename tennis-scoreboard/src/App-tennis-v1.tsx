import React, { useEffect, useState } from 'react';
import './App.css';

// 网球普通局的标准逻辑

// 普通局里：
// 0 -> Love
// 1 -> 15
// 2 -> 30
// 3 -> 40

// 但如果双方都至少 3 分：

// 相等 -> Deuce
// 一方领先 1 分 -> Advantage A/B
// 一方领先 2 分或更多 -> A/B wins


// 把“状态”和“显示结果”拆成了太多份，导致容易互相打架
function App() {
  const [score1, setScore1] = useState<number>(0);
  const [score2, setScore2] = useState<number>(0);

  // 只保留 score1 和 score2 作为核心状态，
  // call1、call2、currentCall 都不要再单独存 state，而是根据 score 实时计算出来。
  // 它们都属于“derived state（派生状态）”，不适合再单独 useState！！！！ 

  const [call1, setCall1] = useState<string>("Love");
  const [call2, setCall2] = useState<string>("Love");
  const [currentCall, setCurrentCall] = useState<string>("Love-Love");

  function handleScore1() {
    // 一次点击里可能 setScore 多次：虽然某些条件互斥，但这种写法非常危险，而且读起来很难判断

    // 这里的if判断也有问题 ：
    // React 的 setState 不是立刻改值的，所以这里判断的还是当前渲染时的 score1，不是点完之后的新分数
    if (score1 < 3) setScore1(s => s + 1);

    if (score1 >= 3 && score2 === score1) {
      setScore1(s => s + 1);
      setCurrentCall("Advantage A")
      // 不要把两个set写在一个函数逻辑里
      // 现在的写法会让逻辑分散在点击函数和 useEffect 里，难保证一致
    }

    if (score1 === score2 + 1 && score2 >= 3) {
      setScore1(s => s + 1);
      setCurrentCall("A wins")
    }


    if (score1 >= 3 && score2 === score1 + 1) {
      setScore1(s => s + 1);
      setCurrentCall("Deuce")
    }



    //在这里设置的时候下一次渲染才会改变值 不能在这设置
    // switch (score1) {
    //   case 0:
    //     setCall1("Love")
    //     break;
    // }
  }

  useEffect(
    function () {
      switch (score1) {
        case 0:
          setCall1("Love")
          break;
        case 1:
          setCall1("15")
          break;
        case 2:
          setCall1("30")
          break;
        case 3:
          setCall1("40")
          break;
        case 4:
          setCall1("40")
          break;
        default:
          setCall1("40")
      }
    }, [score1]
  )

  function handleScore2() {
    if (score2 < 3) setScore2(s => s + 1);

    if (score2 >= 3 && score1 === score2) {
      setScore2(s => s + 1);
      setCurrentCall("Advantage B")
    }

    if (score2 === score1 + 1 && score1 >= 3) {
      setScore2(s => s + 1);
      setCurrentCall("B wins")
    }


    if (score2 >= 3 && score1 === score2 + 1) {
      setScore2(s => s + 1);
      setCurrentCall("Deuce")
    }


  }
  useEffect(
    function () {
      switch (score2) {
        case 0:
          setCall2("Love")
          break;
        case 1:
          setCall2("15")
          break;
        case 2:
          setCall2("30")
          break;
        case 3:
          setCall2("40")
          break;
        case 4:
          setCall2("40")
          break;

        default:
          setCall2("40")
      }
    }, [score2]
  )

  useEffect(
    function () {
      // 缺了很多情况：例如40-40 之后不只是一次 deuce，可能无限次 deuce
      // 现实中很少有这种枚举写法吧。。。要抽取核心逻辑，枚举不是办法呀
      if (score1 === 0 && score2 === 0) setCurrentCall("Love-Love");

      if (score1 === 0 && score2 === 1) setCurrentCall("Love-15");
      if (score1 === 0 && score2 === 2) setCurrentCall("Love-30");
      if (score1 === 0 && score2 === 3) setCurrentCall("Love-40");

      if (score1 === 1 && score2 === 1) setCurrentCall("15-15");
      if (score1 === 1 && score2 === 2) setCurrentCall("15-30");
      if (score1 === 1 && score2 === 3) setCurrentCall("15-40");


      if (score1 === 2 && score2 === 1) setCurrentCall("30-15");
      if (score1 === 2 && score2 === 2) setCurrentCall("30-30");
      if (score1 === 2 && score2 === 3) setCurrentCall("30-40");

      if (score1 === 3 && score2 === 1) setCurrentCall("40-15");
      if (score1 === 3 && score2 === 2) setCurrentCall("40-30");
      if (score1 === 3 && score2 === 3) setCurrentCall("deuce");

      if (score1 === 1 && score2 === 0) setCurrentCall("15-Love");
      if (score1 === 2 && score2 === 0) setCurrentCall("30-Love");
      if (score1 === 3 && score2 === 0) setCurrentCall("40-Love");



    }, [score1, score2]
  )

  function handleReset() {
    setScore1(0)
    setScore2(0)
    // 没有重置 call   虽然 useEffect 最终会改回来，但这更加说明 call1/call2/currentCall 不该单独存成useState！！

  }


  // 写几个函数专门负责显示call1 2和currentcall：
  // getPointName(score)
  // getCurrentCall(score1, score2)


  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <h3>Tennis Scoreboard</h3>
      <h4>Set1~Mode:Normal Game</h4>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem", }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "2rem", }}>
          <h4>Player A</h4>
          <div className='board'>
            <h2>{call1}</h2>
          </div>
          <button onClick={handleScore1}>Score</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "2rem", }}>
          <h4>Player B</h4>
          <div className='board'>
            <h2>{call2}</h2>
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
