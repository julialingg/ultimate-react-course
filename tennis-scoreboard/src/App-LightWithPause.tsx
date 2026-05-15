import { useEffect, useRef, useState } from 'react';
import './App.css';

type LightKey = 'red' | 'green' | 'yellow';

const LIGHTS: Record<LightKey, { next: LightKey; duration: number }> = {
  red: { next: 'green', duration: 5000 },
  green: { next: 'yellow', duration: 4000 },
  yellow: { next: 'red', duration: 2000 },
};

export default function App() {
  const [light, setLight] = useState<LightKey>('red');
  const [isPause, setIsPause] = useState(false);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const remainingRef = useRef(LIGHTS.red.duration);

  useEffect(() => {
    if (isPause) return;

    // startTime 必须表示：这一次倒计时是从什么时候开始走的
    // 所以它应该在 setTimeout(...) 被创建的那一刻记录，而不是等回调执行时再记录。
    startTimeRef.current = Date.now();


    // setTimeout(fn, delay)  函数是 告诉浏览器：请在 delay 毫秒后执行 fn
    timerRef.current = window.setTimeout(() => {
      // 从这里是回调函数开始执行， 计时已经结束了！！！
      //  为什么叫“回调”
      // 因为流程是：你调用 setTimeout
      // 把函数交给它  n毫秒之后   它“回过头来调用你给的函数”
      const next = LIGHTS[light].next;
      setLight(next);
      remainingRef.current = LIGHTS[next].duration;
    }, remainingRef.current);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [light, isPause]);

  function handlePause() {
    if (!isPause) {
      // pause会做两件事：
      // 清掉当前 timeout
      // 计算已经过了多久，更新剩余时间

      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }

      const elapsed = Date.now() - startTimeRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
      setIsPause(true);
    } else {
      // resume
      // 点击 Continue
      // 只是把 isPause 改回 false。
      // 然后 effect 会重新运行，用 remainingRef.current 再开一个 remainingRef 的 timeout。
      // 这样就是真正的“恢复”。
      setIsPause(false);
    }
  }

  return (
    <>
      <h1>{light}</h1>
      <button onClick={handlePause}>
        {isPause ? 'Continue' : 'Pause'}
      </button>
    </>
  );
}