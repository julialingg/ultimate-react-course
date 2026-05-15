import { useEffect, useRef, useState } from 'react';
import './App.css';

// Toast 消息系统（自动消失 + 队列）
// ⏱ 自动消失
// 每个 toast：
// 显示后 3秒自动消失 
// 消失后从列表中移除 


// 🧨 手动关闭   • 点击x后立即消失 

type Toast = {
  id: number;
  text: string;
  startTime: number;
}

function App() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // 如果这个 timer 只在 effect 里创建和清理，最简单的是直接用局部变量  不需要用ref
  const timerRef = useRef(0)

  // TODO 为啥不能用let?
  const id = useRef(0);
  function handleAddToast() {
    id.current += 1;
    setToasts(prev => [...prev, { id: Number(id.current), text: `Message ${id.current}`, startTime: Date.now() }]);

  }

  useEffect(() => {
    timerRef.current = window.setInterval(() => {


      // 删除对应的toast
      //find 一个 toast → 删除一个    这个思路不够好，
      // 正确思路应该是   所有过期的 toast 一次性删掉
      // const toast = toasts.find(t => now - t.startTime >= 3000 ? t : null)
      // if (toast) setToasts(prev => prev.filter(p => p.id !== toast.id ? p : null))

      //  建模能力 
      // 你在做： ❌ “找一个 → 删除一个”

      // 而正确是：
      // ✅ “定义规则 → 过滤所有”
      // 👉 这是你现在最需要突破的思维：
      // 不要操作某个具体元素    而是描述“哪些应该存在”
      setToasts(prev =>
        prev.filter(t => Date.now() - t.startTime < 3000)
      );


    }, 100)


    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    }

    // 错误： useEffect 的依赖写成 [toasts]，会导致反复创建和销毁 interval。
    // 你在让 effect 跟着“数据变化”频繁重跑，但这个副作用本身其实不应该依赖整个列表频繁重建。

    //     这里的问题是什么
    // 因为依赖是 [toasts]：
    // 每次新增 toast，effect 重跑一次
    // 每次删除 toast，effect 重跑一次
    // 每 100ms 过滤后只要数组变化，effect 又重跑一次

    // 也就是说：

    // 建一个 interval
    // interval 触发后 setToasts
    // toasts 变了
    // effect cleanup
    // 再建一个新的 interval

    // 这会让整个定时器系统一直被重建。
    // 虽然 React 会先清理旧 interval，再建新 interval，所以通常不会无限叠加，但这设计上不优雅，也不稳定。


  }, [])

  //   什么时候用 useEffect

  // 不是看“我用了异步”，也不是看“有数据变化”，而是看： 我是不是要和 React 渲染之外的世界建立同步关系？


  // 那依赖怎么判断
  // 看 effect 内部真正依赖哪些“外部值”。
  // 你现在 interval 的逻辑只依赖：

  // setToasts 这个稳定函数
  // Date.now() 这个全局函数
  // 回调里的 prev

  // 所以不需要 [toasts]。

  function handleDeteleToast(id: number) {
    setToasts(prev => prev.filter(p => p.id !== id));

  }



  return (
    <>
      <button onClick={handleAddToast}>Add</button>
      <ul>
        {toasts.map(t =>
          <li key={t.id}>{t.text}
            <button onClick={() => handleDeteleToast(t.id)}> X</button>
          </li>)}
      </ul>
    </>

  )
}
export default App;
