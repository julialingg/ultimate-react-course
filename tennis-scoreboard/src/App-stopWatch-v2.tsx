import React, { useEffect, useRef, useState } from 'react';
import './App.css';



function App() {
  // 把 boolean 升级成有限状态机
  // 业务状态有几种，就老老实实建模成几种  而不是硬塞进 true / false。
  type Status = 'idle' | 'running' | 'paused';
  const [status, setStatus] = useState<Status>('idle');

  const [elapsedTime, setElapsedTime] = useState(0); //用于显示在页面上
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimeRef = useRef(0); // 当前计时基准时间  
  const accumulatedTimeRef = useRef(0);//已经累计的总运行时间




  function handleStart() {
    if (status !== "idle") return;

    // 如果以后你改需求，比如从 idle 再次 start 前没走 reset，可能会有残留问题。
    // 更稳一点可以在 start 时明确把elapsedTime和accumulatedTimeRef清零：
    setElapsedTime(0);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = Date.now();
    setStatus("running");

  }

  function handlePause() {
    if (status !== "running") return;


    accumulatedTimeRef.current = Date.now() - startTimeRef.current;
    setElapsedTime(accumulatedTimeRef.current)
    // 上面这两行能看出来    两个数据在暂停时被同步成一样的  这能说明其实存在重复
    //     更好的问题是：
    // 你到底把谁当真相？
    // 目前看起来：
    // 页面显示靠 elapsedTime
    // resume 计算靠 accumulatedTimeRef
    // 也就是说两个值都像“真相”。

    // 解决方法：其实可以删掉accumulatedTimeRef，只用elapsedTime
    // resume的时候 startTimeRef.current = Date.now() - elapsedTime;
    //为什么这是更好的设计

    // elapsedTime 本来就是 UI 真正显示的总时间
    // 暂停时它已经停在正确值   resume 直接基于它继续就行
    // 于是：
    // elapsedTime 是“总已运行时间”的单一来源




    setStatus("paused");

  }

  function handleResume() {
    if (status !== "paused") return;

    startTimeRef.current = Date.now() - accumulatedTimeRef.current;
    setStatus("running");
  }

  function handleReset() {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setStatus("idle");
    setElapsedTime(0);
    timerRef.current = null;
    startTimeRef.current = 0;
    accumulatedTimeRef.current = 0;
  }



  useEffect(() => {
    if (status !== "running") return;

    timerRef.current = setInterval(() => {
      setElapsedTime(Date.now() - startTimeRef.current);
    }, 100)


    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    // setElapsedTime 不需要进依赖数组   因为 React 的 state setter 是稳定引用，不需要作为依赖写进去
  }, [status])


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
