import { useEffect, useRef, useState } from 'react';
import './App.css';

// 	倒计时器（countdown）+ 自动结束 + 按钮禁用

// 注意单位换算，计算的时候要统一单位，只在显示页面的时候换成秒就好了

function App() {
  const [totalTime, setTotalTime] = useState(0)

  // const status= ["idle",]
  type Status = 'idle' | 'running' | 'paused' | 'end';
  const [status, setStatus] = useState<Status>("idle");
  const startTimeRef = useRef(0);

  const [elapsedTime, setElapsedTime] = useState(0);
  // 当 timer 需要在多个地方访问（不只在 useEffect 里）时，就应该用 useRef
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);


  function handleStart() {
    if (status !== "idle" || totalTime <= 0) return;

    startTimeRef.current = Date.now();
    setStatus("running");


  }

  function handlePause() {
    if (status !== "running") return;
    const now = Date.now();
    setElapsedTime(now - startTimeRef.current);
    setStatus("paused");

  }

  function handleResume() {
    if (status !== "paused") return;

    // setTotalTime(prev => prev - elapsedTime);   
    // 如果保持totaltime不变的话
    startTimeRef.current = Date.now() - elapsedTime;
    console.log("elasped", elapsedTime)
    setStatus("running");
  }
  function handleReset() {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null
    }

    setTotalTime(0);
    setElapsedTime(0);
    setStatus("idle");
    startTimeRef.current = 0;

  }

  useEffect(() => {
    if (status !== "running") return;




    timerRef.current = setInterval(() => {
      const now = Date.now();
      const nextElapsed = now - startTimeRef.current;

      if (nextElapsed >= totalTime * 1000) {
        setElapsedTime(totalTime * 1000);
        setStatus("end");
        // 自动结束时要停掉 interval
        if (timerRef.current !== null) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

      } else {
        setElapsedTime(nextElapsed);
      }

      // TODO  为啥这里赋值，然后直接写 {totalTime } 页面不变呢
      // setTotalTime(prev => prev - elapsedTime);
      // 因为 totalTime 代表的是“用户输入的总时长”，不是“剩余时间”。
      // 你现在的建模里：
      // 	• totalTime = 总时间 
      // 	• elapsedTime = 已经过了多久 
      // 	• 页面显示的剩余时间 = totalTime - elapsedTime 
      // 所以页面上应该显示的是：

      // remainingTime = totalTimeMs - elapsedTime
      // 而不是每次去改 totalTime。
      // 也就是说
      // totalTime 不应该在倒计时过程中不断减少。
      // 它应该保持不变，作为“初始总时长”。
      // 不要把“总时间”和“剩余时间”混成一个值。


    }, 100)


    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

    }
  }, [status])


  return (



    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "2rem" }}>
      {/* <input value={totalTime} onChange={(e) => setTotalTime(Number(e.target.value))} /> */}
      <input
        type="number"
        min="0"
        step="1"
        value={totalTime}
        onChange={(e) => setTotalTime(Number(e.target.value))}
      />



      {/* 输入的是秒 */}
      {/* 这里其实应该在上面单独写一个const remainingTime   而不是直接列计算式 
      const totalTimeMs = totalTime * 1000;
const remainingTimeMs = Math.max(0, totalTimeMs - elapsedTime);
const remainingSeconds = (remainingTimeMs / 1000).toFixed(1);
*/}
      {(totalTime * 1000 - elapsedTime) / 1000}
      < button onClick={handleStart}> Start</button>
      {/* 按钮禁用的例子  */}
      < button onClick={handlePause} disabled={status !== 'running'}> Pause</button>
      < button onClick={handleResume}> Resume</button>
      < button onClick={handleReset}> Reset</button>
    </div>

  );
}

export default App;
