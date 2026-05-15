import React, { useEffect, useRef, useState } from 'react';
import './App.css';

//  Stopwatch（秒表）
// 要求：
// 	• Start 
// 	• Pause 
// 	• Resume 
// 	• Reset 
// 限制：
// 	• 显示时间必须正确 
// 	• 不能出现重复计时 
// 	• 自己先判断哪些用 state，哪些用 ref，哪些不用存 


// 核心：用时间差计算 + 定时器只是用来“刷新显示”
// 用 state： 
// elapsedTime 因为它要显示在页面上，变化时需要触发重新渲染。
// isRunning 因为按钮状态、逻辑判断会依赖它，变化后也希望组件更新。

// 用 ref：
// timerRef  定时器 id 不需要渲染页面，只是为了后续 clearInterval。
// startTimeRef 开始时刻不需要渲染。
// accumulatedTimeRef 累计的毫秒数只是逻辑数据，不一定每次改都要触发渲染。

function App() {
  const startTimeRef = useRef(0); // 当前计时基准时间  
  // const [isPause, setIsPause] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); //用于显示

  // 我没想到的：
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const accumulatedTimeRef = useRef(0);//注意这里不是暂停前已经累计的时间  而是当前已过总时间快照
  const [isRunning, setIsRunning] = useState(false);



  function handleStart() {
    // 需要区分start和resume
    if (isRunning) return; // 防止重复开启计时

    // 如果是这个流程：
    //     Start
    // Pause，停在 5000
    // 然后用户点击 Start

    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // 保证 Start 应该从 0 重新开始
    accumulatedTimeRef.current = 0;
    setElapsedTime(0)

    startTimeRef.current = Date.now();
    setIsRunning(true)


  }

  function handlePause() {
    //缺少边界值:
    // 如果还没 start 就点 pause
    // 如果已经 pause 了又继续点 pause

    if (!isRunning) return;

    const currentTime = Date.now();
    accumulatedTimeRef.current = currentTime - startTimeRef.current;
    console.log("accumulatedTimeRef.current", accumulatedTimeRef.current)
    setIsRunning(false);
    //没想到的：
    setElapsedTime(accumulatedTimeRef.current);

  }

  function handleResume() {
    //缺少边界值:
    if (isRunning || accumulatedTimeRef.current === 0) return;

    //resume 核心点： 把开始时间倒推回去，让当前继续计时的时候，之前的 elapsedTime 能接上
    startTimeRef.current = Date.now() - accumulatedTimeRef.current;
    setIsRunning(true);
  }

  function handleReset() {
    startTimeRef.current = 0;
    accumulatedTimeRef.current = 0;
    setIsRunning(false);
    setElapsedTime(0);
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      // 清掉了 interval，要把 ref 置空。不然这个 ref 里还留着旧 id，语义上不干净。
      timerRef.current = null;
    }
  }


  // useEffect 不是“值变了就顺手算点东西”的地方
  useEffect(() => {
    if (!isRunning) {
      // 虽然 cleanup 里会清 interval，但最好顺手把 ref 也置空
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // 这个可以不写，因为handlePause里面已经有了
      // setElapsedTime(accumulatedTimeRef.current)
      return;
    }




    // setInterval 每隔固定时间更新一次计时
    timerRef.current = setInterval(() => {
      setElapsedTime(Date.now() - startTimeRef.current);
    }, 100)


    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        // 清掉了 interval，要把 ref 置空。不然这个 ref 里还留着旧 id，语义上不干净。
        timerRef.current = null;
      }
    }

  }, [isRunning])


  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "2rem" }}>
      {elapsedTime}
      < button onClick={handleStart}> Start</button>
      < button onClick={handlePause}> Pause</button>
      < button onClick={handleResume}> Resume</button>
      < button onClick={handleReset}> Reset</button>
    </div>
  );
}

export default App;
