import { useState } from "react";
import type { Friend } from "../App";

interface AddNewFriendFormProps {
  onAddNewFriend: (item: Friend) => void;

}


export default function AddNewFriendForm({ onAddNewFriend }: AddNewFriendFormProps) {
  const [name, setName] = useState<string>("")
  const [image, setImage] = useState<string>("https://i.pravatar.cc/48?u=118836")

  function handleAddNewFriend(e: React.FormEvent<HTMLFormElement>) {
    // 添加了new friend之后，只出现了1s就消失，页面像是重新渲染了一样
    //需要调用 e.preventDefault() 来阻止表单默认的页面刷新行为
    e.preventDefault()
    const newFriend = { id: Number(Date.now()), name, image, balance: 0 }
    onAddNewFriend(newFriend)
    setName("")
    setImage("https://i.pravatar.cc/48?u=118836")

  }

  return (

    // margin: "0 auto" - 让表单在页面上水平居中
    // gap: "10px" - 为表单内的输入框和按钮添加间距，提升视觉效果

    // justifyContent: "center" 是让表单内部的内容（输入框和按钮）在垂直方向上居中。
    // 具体来说：
    // display: "flex" - 启用 flexbox 布局
    // flexDirection: "column" - 改变主轴方向为纵向（竖直）
    // justifyContent: "center" - 让 flex 项目沿着主轴的中心对齐
    // 在这个情况下，主轴是纵向的，所以 justifyContent: "center" 会让输入框和按钮在表单容器内垂直居中。


    <form onSubmit={handleAddNewFriend} style={{
      width: "23%", display: "flex",
      flexDirection: "column", margin: "0 20rem", gap: "10px"
    }}>
      <input
        placeholder="Friend name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />


      <button type="submit">Add</button>
    </form>

  )
}