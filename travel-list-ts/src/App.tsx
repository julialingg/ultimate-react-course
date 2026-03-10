import React, { useState, Dispatch, SetStateAction } from 'react';
import './App.css';

// 定义一个entity的时候，一定要考虑是否需要id  删除和修改一般都需要用id做匹配
interface Item {
  id: number; // id 如果是 Date.now() 生成的，用 string 更合适     虽然Date.now() 返回的是 number
  //  在实际开发中，id 通常用 string 类型更安全。因为 id 往往用于比较、存储或传递给 API，
  // 而 string 可以避免潜在的类型转换问题（如 JSON 序列化时）。
  // 此外，如果将来切换到 UUID 或其他字符串 id 生成方式，string 类型更灵活。
  // 保持类型一致性可以减少 TypeScript 编译时的警告和运行时错误。
  num: number;
  name: string;
  packed: boolean;

}

function App() {
  // 或者直接不要set 单个的item了.直接setItems
  // const [item, setItem] = useState<Item>({ num: 1, name: "" })
  // list也要指定类型<Item[]>

  const [items, setItems] = useState<Item[]>([])

  function handleClearAll() {
    // 不需要这样写
    // setItems(prev => prev.filter(item => { }))

    // 直接把 items 重置为 []
    setItems([]);

  }
  return (
    <div className="App">

      <Header></Header>

      {/* flex: 1 让中间内容自动扩展占据所有可用空间，从而将 footer 推到底部。 */}
      <div style={{ flex: 1 }}>
        <ItemInput setItems={setItems}  ></ItemInput>

        {/* board里面可以改packed 属性，所以也需要传入setItems */}
        <Board items={items} setItems={setItems} />
      </div>
      <Sort handleClearAll={handleClearAll}></Sort>
      {/* 记住参数写法 */}
      <Footer items={items}   ></Footer>

    </div>
  );
}

function Header() {
  return <p className='headTitle'>🏝️ Far Away 🧳</p>;
}



interface ItemInputProps {

  // setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  setItems: Dispatch<SetStateAction<Item[]>>;   // 去掉 React. 前缀，更简洁
}

// 要把item 传递给Board组件展示出来 
// 但是ItemInput和Board是同级组件,所以要想办法把item提升到common parent component, which is App component
function ItemInput({ setItems }: ItemInputProps) {
  const [name, setName] = useState<string>("")
  // 初始值必须设成1 因为options从1开始的,没有0    如果设置成0  option会变成不受控的 会报错
  const [num, setNum] = useState<number>(1)



  function handleAddItem() {
    // prev  是 更新之前的 state（旧的 items 数组）
    if (!name.trim()) return;              // 过滤空名
    const newId = Date.now();
    setItems((prev) => [...prev, { id: newId, num, name, packed: false }])
    setName("")

  }
  const options = [1, 2, 3, 4, 5, 6, 7]
  return (
    <div className='inputItems'>
      What do you need for your trip?
      {/* 给 <select> 和 <input> 绑定状态，这样才能把选中的值/文本保存下来并在按钮点击时使用 */}
      {/* value={num} 且给他一个onchange用来改变num的具体值 */}
      <select
        value={num}
        onChange={e => setNum(Number(e.target.value))}>
        {/* 如何保存选中的option 作为num */}
        {/* key={op} value={op} 的作用? */}
        {options.map((op) => <option key={op} value={op}> {op} </option>)}

      </select>
      {/* input 如何保存 作为name */}
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <button onClick={handleAddItem}> ADD </button>
    </div>

  )

}


interface BoardProps {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

// 参数严格按照解构的方式来
function Board({ items, setItems }: BoardProps) {
  const togglePacked = (id: number) => {
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, packed: !i.packed } : i))
    );
  }
  const handleDeleteItem = (id: number) => {
    // 必须用setItems来更新items  不能直接 items.filter 
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div>
      <ul>
        {items.map((i: Item) => (
          <ShowItem
            // key 不是给你在组件里用的，而是给 虚拟 DOM 的比对算法（reconciliation）看的一个身份标识
            // 永远给列表里的元素加key    让 React 知道“这条记录是谁”，从而正确、快速地更新列表
            id={i.id}
            num={i.num}
            name={i.name}
            packed={i.packed}
            onToggle={() => togglePacked(i.id)}
            handleDeleteItem={handleDeleteItem}
          />
        ))}
      </ul>
    </div>
  );
}

//利用继承减少重复
interface ShowItemProps extends Item {
  onToggle: () => void;
  handleDeleteItem: (id: number) => void;
}

function ShowItem({ id, num, name, packed, onToggle, handleDeleteItem }: ShowItemProps) {

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {/* TODO 看怎么设置的间距：可以在父元素里用gap属性 */}

      {/* checkbox是用input */}
      <input
        type='checkbox'
        checked={packed}
        onChange={onToggle}
      />
      <p className='showeditem'> {num}</p>
      <p className='showeditem'> {name}</p>
      <button className='cross' style={{ color: "red" }} onClick={() => handleDeleteItem(id)}> X</button>
    </div>
  );
}

interface SortProps {
  handleClearAll: () => void
}
function Sort({ handleClearAll }: SortProps) {
  const options = ["Sort by Input Order", "Sort by Packed Status"]

  return (
    <div>
      <select>

        {/* 这里不要直接用map来遍历显示option  因为每个option都有自己的操作  */}
        {/* {options.map(op => <option>  {op} </option>)} */}

        <option >Sort by Input Order</option>
        <option>Sort by Packed Status</option>


      </select>

      <button
        style={{ margin: "2rem" }}
        onClick={handleClearAll}>
        Clear All
      </button>
    </div>
  )
}

interface FootProps {
  items: Item[];
}


// TODO: footer 应该stick to the bottom
function Footer({ items }: FootProps) {
  // let num = 0;
  // let percentage = 0
  // function Packednum() {

  //   items.map(item => item.packed === true ? num + 1 : num)
  //   percentage = num / items.length * 100

  //   return num,;

  // }

  const packedNum = items.filter(item => item.packed).length
  // 用Math.round 四舍五入
  //要判断 items.length > 0 ?   是因为直接赋值的话 如果把items都删除了 percentage会变成NaN
  const percentage = items.length > 0 ? Math.round(packedNum / items.length * 100) : 0

  return (
    <p className='footerTitle'>💼 You have {items.length} items on your list, and you already packed {packedNum} ({percentage}%)</p>
  );
}

export default App;
