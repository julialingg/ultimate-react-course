import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

// Toast 消息系统（自动消失 + 队列）
// 每个 toast：
// 显示后 3秒自动消失 
// 消失后从列表中移除 
// 每个都有独立计时
// 🧨 手动关闭   • 点击x后立即消失 
// 多实例 + 副作用管理  👉 防止 effect 重复执行



// 把数据状态放父组件
// 把定时器这种副作用放到子组件里
type Toast = {
  id: number;
  text: string;
}

function App() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const id = useRef(0);

  function handleAddToast() {
    id.current += 1;
    setToasts(prev => [...prev, { id: Number(id.current), text: `Message ${id.current}` }]);
  }


  // 2种删除函数的写法有区别   这里推荐第一版。 
  function handleDelete(id: number) {
    setToasts(prev => prev.filter(p => p.id !== id));
  }

  // const handleDelete = useCallback((id: number) => {
  //   setToasts((prev) => prev.filter((toast) => toast.id !== id));
  // }, []);

  // useCallback 在这里不是必须的   
  // 两者区别在“函数引用是否稳定”： 
  // 第一种写法的普通函数：每次父组件 render，都会创建新函数
  // useCallback：依赖不变时，函数引用稳定

  // 但这里为什么我说“不必须” ？
  // 因为你没有做这些优化：
  // 没有 React.memo(Toast)
  // 没有把这个函数传到深层并依赖引用稳定性
  // 没有把它作为别的 effect 的敏感依赖去优化性能

  // 所以这里加 useCallback 不是错，
  // 但更像是**“先用了一个技巧”，但还没遇到它真正该解决的问题”**。
  // 等以后遇到明确的性能问题或 memo 配合场景，再上 useCallback



  return (
    <>
      <button onClick={handleAddToast}>Add</button>
      <ul>
        {toasts.map(t => <Toast key={t.id} toast={t} onDelete={handleDelete} />
        )}
      </ul>
    </>

  )
}


interface ToastProps {
  toast: Toast;
  onDelete: (id: number) => void;
}

function Toast({ toast, onDelete }: ToastProps) {

  // 这就是这道题最好的训练点：
  // 	• state 在父组件 
  // 	• 副作用在子组件 
  // 生命周期跟组件实例绑定 

  //   每个 toast 自己挂载时启动一个 timer，卸载时清理 timer。
  // 这比在父组件里集中管理一堆 timer 更自然。

  useEffect(() => {
    const timer = setTimeout(() => {
      onDelete(toast.id);
    }, 3000)

    return () => clearTimeout(timer);
    //  虽然能跑，但是这里依赖不应该写空数组。
    // 因为 effect 里实际用了：
    // onDelete
    // toast.id

  }, [toast.id, onDelete])

  return (
    <>
      {/* key={toast.id}  在父组件写li的key  */}
      {/* 因为 key 是 React 在父组件渲染列表时用来识别兄弟元素的。 */}
      {/* 写在 Toast 组件内部的 <li> 上，对外层列表 diff 没帮助。 */}
      <li>
        {toast.text}
        <button onClick={() => onDelete(toast.id)}>X</button>
      </li>

    </>
  )

}


export default App;
