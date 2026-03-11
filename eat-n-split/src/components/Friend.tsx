import { useState } from "react";
import { Bill } from "../App";


interface FriendProps {
  id: number;
  name: string;
  image: string;
  balance: number;
  onSplitBalance: (id: number, amount: number) => void;


}

export default function Friend({ id, name, image, balance, onSplitBalance }: FriendProps) {

  const [splitFormIsOpen, setSplitFormIsOpen] = useState<boolean>(false);


  // 计算账单需要的
  const [total, setTotal] = useState<number>(0)
  const [myExpense, setMyExpense] = useState<number>(0)
  const [whoPay, setWhoPay] = useState<string>("You")


  function onOpenSplitForm() {
    setSplitFormIsOpen((splitFormIsOpen) => !splitFormIsOpen);
  }

  function handleSplitBill(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let friendExpense = 0
    // balance 是负数，就是我欠对方钱
    if (whoPay === "You") friendExpense = total - myExpense;


    else {
      friendExpense = myExpense - total;
    }
    onSplitBalance(id, friendExpense)

  }




  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-start", margin: "0 20rem" }}>

        <img style={{ width: "3rem", height: "3rem", margin: "1.5rem 2rem" }} src={image} alt={name} />

        {/* 现在文字左对齐 */}
        <div style={{ width: "15%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <h4 style={{ margin: "1rem 0rem" }}> {name}</h4>
          {/* {balance == 0 && <h5> You and {name} are even</h5>}
          {balance > 0 ? <h5>{name} owes you {balance} €</h5> : <h5> You owes {name} {balance} €</h5>} */}

          {/* 连续用？ ： */}
          <h5 style={{ margin: "0rem 0rem" }}>
            {balance === 0
              ? `You and ${name} are even`
              : balance > 0
                ? `${name} owes you ${balance} €`
                : `You owe ${name} ${Math.abs(balance)} €`}
          </h5>
        </div>

        <button style={{ width: "3rem", height: "3rem", margin: "2rem 2rem" }} onClick={() => onOpenSplitForm()}>Select</button>

      </div>


      {/* split bill form  */}
      {splitFormIsOpen &&
        <form onSubmit={handleSplitBill}>
          Split a bill with  {name}
          <div style={{ display: "flex" }}>
            <h3> 💰 Bill value</h3>
            <input
              value={total}
              onChange={(e) => setTotal(Number(e.target.value))}>
            </input>
          </div>

          <div style={{ display: "flex" }}>
            <h3> 🧍‍♀️ Your expense</h3>
            <input
              value={myExpense}
              onChange={(e) => setMyExpense(Number(e.target.value))}>
            </input>
          </div>

          <div style={{ display: "flex" }}>
            <h3> 👫  {name}'s expense</h3>
            <input
              value={total - myExpense}
              disabled
            >
            </input>
          </div>


          <div style={{ display: "flex" }}>
            <h3>🤑 Who is paying the bill</h3>
            <select value={whoPay} onChange={(e) => setWhoPay(e.target.value)}>
              <option value="You"> You</option>
              <option value="Friend">  {name}</option>
            </select>
          </div>

          <button type="submit">Split Bill</button>

        </form>
      }
    </>
  )


}

// interface SplitBillFormProps {
//   onSplitBill: (bill: Bill) => void;
// }


// function SplitBillForm({ onSplitBill }: SplitBillFormProps) {
//   //TODO 想了很久怎么传递信息   把这个组件和friend合并 就简单了！！！！
//   function handleSplitBill() {
//     const newBill = { total, myExpense, whoPay }
//     onSplitBill(newBill)

//   }
// }