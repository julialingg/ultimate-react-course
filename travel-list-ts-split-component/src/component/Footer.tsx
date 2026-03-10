import { Item } from "../App"

interface FooterProps {
  items: Item[]

}

export default function Footer({ items }: FooterProps) {
  const packedList = items.filter((i) => i.packed).length ?? 0
  const percentage = packedList > 0 ? Math.round(packedList / items.length * 100) : 0

  return (
    <>
      {
        items.length > 0 ?
          <h3> 💼 You have {items.length} items on your list, and you already packed  {packedList} ({percentage}%)</h3>
          : <h3>Start adding some items to your packing list 🚀</h3>
      }

    </>
  )

}