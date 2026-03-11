import React, { useState } from 'react';

import './App.css';
import FriendList from './components/FriendList';
// import type { Friend } from './components/Friend';
import Friend from './components/Friend';
import AddNewFriendForm from './components/AddNewFriendForm';

//  同时在一个文件里面 import type { Friend } from './components/Friend'; 和import Friend from './components/Friend';
// 会报错  所以把interface Friend的定义直接挪到app里了  


export interface Friend {
  id: number;
  name: string;
  image: string;
  // 可以计算得出的
  // expense: number;
  balance: number;

}
const initialFriends: Friend[] = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export interface Bill {
  total: number;
  myExpense: number;
  whoPay: string;
}
function App() {
  const [addFriendIsOpen, setAddFriendIsOpen] = useState<boolean>(false);


  const [friends, setFriends] = useState<Friend[]>(initialFriends)



  function handleToggleAddFriendForm() {
    setAddFriendIsOpen((addFriendIsOpen) => !addFriendIsOpen);
  }


  function onAddNewFriend(friend: Friend) {
    setFriends((friends) => [...friends, friend])

  }

  function onSplitBalance(id: number, friendExpense: number) {
    //  又少写了一层箭头函数  要把friends也包一下  
    // setFriends((friends.map(f => f.id === id ? { ...f, balance: f.balance + friendExpense } : f)))

    setFriends((friends) => (friends.map(f => f.id === id ? { ...f, balance: f.balance + friendExpense } : f)))

  }

  return (
    <div className="App">
      <FriendList >
        {friends.map((f) =>
          <Friend
            // key 和id重复冗余吗
            key={f.id}
            id={f.id}
            name={f.name}
            image={f.image}
            balance={f.balance}
            onSplitBalance={onSplitBalance}
          ></Friend>)}

      </FriendList>


      {/* SplitBillForm 好像和friend在同一个文件更好操作数据  而不是分成2个组件 */}
      {/* {
        splitFormIsOpen && (<SplitBillForm onSplitBill={onSplitBill}></SplitBillForm>)
      } */}


      {/* Add Friend和close 两个button可以合成一个 */}
      {!addFriendIsOpen && <button onClick={handleToggleAddFriendForm}>Add Friend</button>}

      {addFriendIsOpen && (<>
        <AddNewFriendForm onAddNewFriend={onAddNewFriend} />
        <button onClick={handleToggleAddFriendForm}>Close</button>
      </>)
      }


    </div>
  );
}

export default App;
