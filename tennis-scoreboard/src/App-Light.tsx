import { useEffect, useState } from 'react';
import './App.css';

// 核心就是要你摆脱 if 驱动思维 
// if (light === 'red') ...
// if (light === 'green') ...   这些是错误写法

// 实现一个交通灯：
// 状态循环：Red → Green → Yellow → Red
// 每个状态持续时间
// Red: 5秒
// Green: 4秒
// Yellow: 2秒


// 学会：把现实规则抽象成“状态机”   用数据结构表达规则，而不是 if
type LightKey = 'red' | 'green' | 'yellow';

//用对象建模规则
// Record 会  强制你“写全所有状态”   && 防止你写错 key
// 什么时候你应该想到用 Record？  当你遇到这种结构： 一组固定 key → 对应一组结构
const LIGHTS: Record<LightKey, { next: LightKey; duration: number }> = {
  // Record<LightKey, { next: LightKey; duration: number }>  记录一个对象的格式  它的 key 必须是 LightKey，value 必须是指定结构

  // Record<LightKey, T> 在这里等价于  {
  //   red: T;
  //   green: T;
  //   yellow: T;
  // }


  // 如果我是 red，我需要知道什么？
  // 我要持续多久（duration）
  // 下一步去哪（next）
  // 让“状态自己带规则”


  //   你以前是：
  // if red → green   if green → yellow
  // 现在你要变成：
  // red 自己就知道 → green
  // 👉 这叫：把规则“内聚”到数据里
  red: { next: 'green', duration: 5000 },
  green: { next: 'yellow', duration: 4000 },
  yellow: { next: 'red', duration: 2000 },
};

// type LightKey = keyof typeof LIGHTS;


export default function App() {



  // state ≠ 数据本体    state = “索引 / 标识”
  // light不能是string类型，  因为 LIGHTS 只能用 'red' | 'green' | 'yellow' 这些特定 key 去索引。
  const [light, setLight] = useState<LightKey>("red");
  const [isPause, setIsPause] = useState<boolean>(false)

  // 现在的暂停逻辑是错的

  // 涉及时间的，是副作用，用Effect
  useEffect(() => {

    const current = LIGHTS[light];
    let startTime = 0;
    let remaining = current.duration;  //remaining 是局部变量，下一次 render 就没了 一旦组件重新渲染，这个变量就会被重新创建，  所以你暂停时算出来的“剩余时间”，根本没有被保存下来

    const timer = setTimeout(() => {
      //写在这里是  startTime 是在“定时器触发的时候”才记录的
      //       但暂停时你想算的是：
      // “这个灯从什么时候开始亮，到现在过去了多久”
      // 所以 startTime 应该在定时器开始计时之前记录，而不是执行回调时才记录
      startTime = Date.now();
      setLight(current.next);

    }, remaining);

    if (isPause) {
      clearTimeout(timer);
      remaining -= (Date.now() - startTime)
    }

    return () => clearTimeout(timer);

  }, [light, isPause]);




  //  表面也能跑，但有风险： 因为 light 在闭包里可能是旧值。  
  //   setTimeout(() => {
  //   setLight(LIGHTS[light].next);
  // }, LIGHTS[light].duration);


  function handlePasue() {
    setIsPause(p => !p)
  }
  return (
    <>
      {light}
      <button onClick={handlePasue}> {isPause ? "Continue" : "Pause"}  </button>
    </>
  )


}