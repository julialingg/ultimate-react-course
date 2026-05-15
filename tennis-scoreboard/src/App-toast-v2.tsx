import { useRef, useState } from 'react';
import './App.css';

// Toast 消息系统（自动消失 + 队列）
// ⏱ 自动消失
// 每个 toast：
// 显示后 3秒自动消失 
// 消失后从列表中移除 
// 每个都有独立计时

// 🧨 手动关闭   • 点击x后立即消失 

// 如果你想更贴合“每个 toast 各自 3 秒后消失”，其实还可以做成：

// 添加一个 toast 时
// 同时给这个 toast 单独开一个 setTimeout
// 3 秒后删除对应 id
// 这种实现更符合“每个 toast 独立生命周期”。

// 现在 还不是这道题最推荐的 React 写法
type Toast = {
  id: number;
  text: string;
  startTime: number;
}

function App() {
  const [toasts, setToasts] = useState<Toast[]>([]);


  const id = useRef(0);
  function handleAddToast() {
    id.current += 1;
    // 开始意识到闭包问题： 专门用 newid 避免了 id.current 变化带来的 bug
    const newid: number = id.current;
    setToasts(prev => [...prev, { id: Number(id.current), text: `Message ${id.current}`, startTime: Date.now() }]);


    // 副作用还是应该放在effect里面
    setTimeout(() => {
      setToasts(prev => prev.filter(p => p.id !== newid));
    }, 3000)


    //这样是只删除了最后一个  因为id.current总会是最后一次的id
    //     //   setTimeout(() => {
    //     setToasts(prev => prev.filter(p => p.id !== id.current));
    //   }, 3000)


  }



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
