import React, { useState } from 'react';
import './App.css';
import Footer from './component/Footer';
import Form from './component/Form';
import Item from './component/Item';
import Sort from './component/Sort';


export interface Item {
  id: number;
  name: string;
  amount: number;
  packed: boolean;

}
function App() {
  const [items, setItems] = useState<Item[]>([])

  //Form 添加items
  function onAddItems(item: Item) {
    //  [...i, item] 复制旧数组 + 添加新元素
    setItems((i) => [...i, item])
  }

  // board里面X删除某个item
  function handleDeleteItem(id: number) {
    // 直接使用 items 不够安全  需要让items变成参数，然后用箭头函数更新
    // setItems(items.filter(i => (i.id != id)))
    setItems((items) => items.filter(i => (i.id != id)))


  }
  function itemToggle(id: number) {
    // setItems(items.map(i => (i.id === id ? { ...i, packed: !packed } : i)))
    // 直接使用 items 不够安全  需要让items变成参数，然后用箭头函数更新
    // setItems(items.map(i => (i.id === id ? { ...i, packed: !i.packed } : i)))
    setItems((items) => items.map(i =>
      i.id === id ? { ...i, packed: !i.packed } : i
    ))
  }

  function handleDeleteAll() {
    setItems([])
  }

  const [sortedBy, setSortedBy] = useState<string>("time")



  // 这样直接修改items无法实现排序  
  // 会报错Too many re-renders. React limits the number of renders to prevent an infinite loop.
  // if (sortedBy === "name") {
  //   setItems(items.sort((a, b) => a.name.localeCompare(b.name)))
  // }
  // if (sortedBy === "packed") {
  //   setItems(items.sort((a, b) => Number(a.packed) - Number(b.packed)))
  // }

  // 正确排序写法  不要修改原来的items  计算排序后的列表（不修改 state）
  let displayItems = [...items]
  if (sortedBy === "name") {
    displayItems.sort((a, b) => a.name.localeCompare(b.name))
  }
  if (sortedBy === "packed") {
    displayItems.sort((a, b) => Number(a.packed) - Number(b.packed))
  }
  return (
    <div className="App">

      <Header></Header>
      <Form onAddItems={onAddItems}></Form>
      {/* TODO board和item可以改成composition  这样就不用一级一级传 handleDeleteItem和itemToggle*/}
      {/* <Board itemList={items} handleDeleteItem={handleDeleteItem} itemToggle={itemToggle}></Board> */}

      <Board2>
        {displayItems.map((item) => (
          <Item
            // key 是 React 的特殊属性，它不会被传递给组件的 props。React 内部用它来识别列表中哪个元素发生了变化。
            key={item.id}
            item={item}
            handleDeleteItem={handleDeleteItem}
            itemToggle={itemToggle}
          />
        ))}
      </Board2>

      {/* <Sort handleDeleteAll={handleDeleteAll} items={items}></Sort> */}
      <Sort handleDeleteAll={handleDeleteAll} sortedBy={sortedBy} onSortChange={setSortedBy}></Sort>
      <Footer items={items}></Footer>

    </div>
  );
}

function Header() {
  return (
    <h1>🏝️ Far Away 🧳</h1>
  )
}



interface BoardProps {
  itemList: Item[]
  handleDeleteItem: (id: number) => void
  itemToggle: (id: number) => void
}

function Board({ itemList, handleDeleteItem, itemToggle }: BoardProps) {
  return (
    <>
      {
        itemList.map((item) => <Item item={item} handleDeleteItem={handleDeleteItem} itemToggle={itemToggle}></Item>)
      }
    </>
  )

}

//改成component composition的形式：
interface Board2Props {
  //TODO children的type是React.ReactNode
  children: React.ReactNode
}

function Board2({ children }: Board2Props) {
  return (
    <>
      {children}
    </>
  )
}

export default App;
