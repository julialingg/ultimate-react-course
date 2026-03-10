// import { Item } from "../App"
//Import 'Item' conflicts with local value,
// so must be declared with a type-only import when 'isolatedModules' is enabled.
// import的时候报错，是因为Item这个type和 这个组件的名字重复了  这时候把import改成 import type 即可
import type { Item } from "../App";

interface ItemProps {
  item: Item;
  handleDeleteItem: (id: number) => void
  itemToggle: (id: number) => void
}


export default function Item({ item, handleDeleteItem, itemToggle }: ItemProps) {

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>

      <input
        type="checkbox"
        // value={Boolean(item.packed)}    不用value赋值 用checked
        checked={item.packed}
        onChange={() => itemToggle(item.id)}
      ></input>
      <h4> {item.amount}</h4>
      <h4> {item.name}</h4>

      {/* TODO onClick函数的写法  */}
      <button onClick={() => handleDeleteItem(item.id)}>X</button>
    </div>
  )

}