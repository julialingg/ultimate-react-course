import { useState } from "react"
import { Item } from "../App"

// 这样不对。 因为items必须得用setItems来改啊！！！！！！ 
// interface SortProps {
//   handleDeleteAll: () => void
//   //为了让排序后的items可以显示在board上，只能改items本身了
//   items: Item[]

// }


// export default function Sort({ handleDeleteAll, items }: SortProps) {
//   const [sortedBy, setSortedBy] = useState<string>("time")


//   if (sortedBy === "name") {
//     items.sort((a, b) => a.name.localeCompare(b.name));

//   }
//   if (sortedBy === "packed") {
//     items.sort((a, b) => Number(a.packed) - Number(b.packed));
//   }


//   return (
//     <>
//       {/* select也是用value和onChange来绑定成受控组件 */}
//       <select value={sortedBy} onChange={(e) => setSortedBy(e.target.value)}>
//         <option key="time"> Sort by input order</option>
//         <option key="name"> Sort by name</option>
//         <option key="packed"> Sort by packed status</option>
//       </select>
//       <button onClick={handleDeleteAll}>Clear All</button>
//     </>
//   )
// }

interface SortProps {
  handleDeleteAll: () => void
  sortedBy: string
  onSortChange: (sortType: string) => void
}

export default function Sort({ handleDeleteAll, sortedBy, onSortChange }: SortProps) {
  return (
    <>
      <select value={sortedBy} onChange={(e) => onSortChange(e.target.value)}>
        {/* option应该有value属性，不然select的onChange={(e) => onSortChange(e.target.value)}找不到value */}
        <option value="time">Sort by input order</option>
        <option value="name">Sort by name</option>
        <option value="packed">Sort by packed status</option>
      </select>
      <button onClick={handleDeleteAll}>Clear All</button>
    </>
  )
}