import { useState } from 'react';
import './App.css';

// 最重要的一点：区分源数据和派生数据
// 购物车算总价值，total price不需要用一个state单独存。只需要用items来计算出来 存一个const就行


const initialItems = [
  { name: "Apple", price: 2, quantity: 3 },
  { name: "Banana", price: 1, quantity: 5 },
  { name: "Orange", price: 3, quantity: 5 },
];


// 页面需要显示：
// 每个商品的小计
// 总价（Total Price）
interface Item {
  name: string;
  price: number;
  quantity: number;
}

export default function App() {
  // 不要把所有东西都放 state
  // 有些值应该通过计算得到
  const [items, setItems] = useState<Item[]>(initialItems);

  const [name, setName] = useState<string>("")

  // 表单输入本质上是字符串，而不是数字 所以更好的方式是这里设置成string，最后add item的时候再转number
  const [price, setPrice] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(0)
  function handleAddItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const item = {
      name, price, quantity
    }
    setItems(items => [...items, item]);
    setName('');
    setPrice(0);
    setQuantity(0);

  }

  // 用“函数”来表达计算逻辑
  // 总价是算出来的，不是用useEffect同步出来的
  function getTotal(items: Item[]) {
    // 累加应该用reduce   把 items 归约成一个 total
    // TODO reduce语法
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);


    // 这里逻辑能跑，但写法不太好 
    // 因为 map 的语义是：把一个数组映射成另一个数组 而不是返回一个数字或者一个单独的元素

    // let total = 0
    // const t = items.map(i => {
    //   const now = i.price * i.quantity
    //   total += now
    // })
    // console.log(total)  
    // return total
  }

  function getSubtotal(item: Item) {
    return item.price * item.quantity;
  }

  const total = getTotal(items);


  return (
    <>
      <form onSubmit={handleAddItem}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder='name' />
        <input value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder='price' />
        <input value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} placeholder='quantity' />
        <button type='submit'>Add</button>
      </form>
      <ul>
        {/* 这里最好还是把 i.price * i.quantity 提出来作为subtotal  而不是直接计算  
        这种并不是无意义的多写代码，而是明确subtotal这个概念，这也更容易维护
        为什么这很重要？

       因为“建模能力”不只是大结构，也包括：
       你能不能识别业务里的“概念”
       你能不能给概念命名

       在购物车里：price 是单价  quantity 是数量   subtotal 是小计   total 是总价
       当你能把这些概念明确命名出来时，你的代码会一下清晰很多
       */}

        {/* li 一定要有key  */}
        {items.map(i => <li key={`${i.name}`}> {`${i.name}'total price is ${i.price * i.quantity}.`} </li>)}
      </ul>

      {/* 更好的方式： */}
      <ul>
        {items.map((item, index) => {
          const subtotal = getSubtotal(item);
          return (
            <li key={`${item.name}-${index}`}>
              {item.name}: ${item.price} × {item.quantity} = ${subtotal}
            </li>
          );
        })}
      </ul>


      <h3> Total:{total}</h3>
    </>
  )


}