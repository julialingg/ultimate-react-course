import { useState } from "react"
import { Item } from "../App"

interface FormProps {
  // 冒号前面只有名字，后面才是具体的格式形式
  onAddItems: (item: Item) => void

}


// TODO  onAddItems为什么这样传递信息
export default function Form({ onAddItems }: FormProps) {
  const selectOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const [amount, setAmount] = useState<number>(1)
  const [name, setName] = useState<string>("")

  // 用button提交时候的函数
  // function handleAddItem() {
  //这里其实也需要   e.preventDefault()  // ← 必须加这行！告诉浏览器"别用默认行为了"
  //   const newItem = { id: Date.now(), amount, name, packed: false }
  //   onAddItems(newItem)
  // }

  // function 参数改为事件对象：接收 FormEvent 并调用 e.preventDefault()
  // 在handleAddItem处理onAddItem 传递给父组件的是添加newitem
  function handleAddItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()   // 很重要！ 阻止页面的默认刷新
    if (name != "") {
      const newItem = { id: Date.now(), amount, name, packed: false }
      onAddItems(newItem)
      setName("")
    }
    else {
      alert("Item name should not be empty")
    }

  }

  return (
    // TODO form怎么直接提交： 使用 form 的 onSubmit 事件   按 Enter 键也能提交
    <form style={{ display: "flex", justifyContent: "center" }} onSubmit={handleAddItem}>

      <h3>What do you need for your 😍 trip? </h3>

      <select
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}>

        {/* option 在这里要加key 是因为：只要用 .map() 遍历数组生成多个 React 元素，都要加 key */}
        {selectOptions.map((op) => <option key={op}>{op}  </option>)}
      </select>

      <input
        placeholder="Item..."
        value={name}
        // TODO onChange写法
        onChange={(e) => setName(e.target.value)}>
      </input>

      {/* 在form里， button 加上 type="submit" 让按钮真正成为提交按钮 */}
      <button type="submit">ADD</button>

      {/* form表单 在 button 上用 onClick 处理， 不太规范 */}
      {/* <button onClick={handleAddItem}>ADD</button>  */}

    </form>

  )

}