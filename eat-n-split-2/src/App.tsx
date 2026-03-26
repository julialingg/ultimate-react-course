import React, { useState } from 'react';
import './App.css';
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    photo: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    photo: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    photo: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

interface Friend {
  // TODO  uuid
  id: number;
  name: string;
  photo: string;
  balance: number;

}

function App() {

  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  // 有必要!
  const [currentFriend, setCurrentFriend] = useState<Friend | undefined>(undefined);

  // add friend的form
  const [isOpen, setIsOpen] = useState<boolean>(false);

  //没用
  // const [isSplitOpen, setIsSplitOpen] = useState<boolean>(false);


  // TODO 用friend   能用完整的对象就别用id啊!!!!
  function handleSelectFriend(friend: Friend) {
    // TODO 注意这里的逻辑很重要, 如果两个id相等, 说明现在已经是选中状态了,那就应该撤销选中; id不等,才说明应该set current friend了
    setCurrentFriend(f => f?.id === friend.id ? undefined : friend);

  }

  // function handleOpenSplitForm() {
  //   setIsSplitOpen(i => !i);
  // }

  function handleSplit(newbalance: number) {
    setFriends(friends => friends.map((f) => (f.id === currentFriend?.id ? { ...f, balance: f.balance + newbalance } : f)))
  }

  function handleOpenAddFriendForm() {
    setIsOpen(i => !i);
  }

  function handleAddFriend(friend: Friend) {
    setFriends(friends => [...friends, friend])
    setIsOpen(false)
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", }}>
          <ul>
            <FriendList>
              {/* TODO  传currentFriend进去 */}
              {friends.map(f => <Friend friend={f} onSelectFriend={handleSelectFriend} currentFriend={currentFriend} />)}
            </FriendList>
          </ul>

          {isOpen && <AddFriend onAddFriend={handleAddFriend} />}
          <button onClick={handleOpenAddFriendForm}>  {isOpen ? "Close" : "Add Friend "} </button>
        </div>

        <div style={{ marginLeft: "1rem", backgroundColor: "#ffa94d" }}>
          {currentFriend && <Split friend={currentFriend} onSplit={handleSplit} />
          }
        </div>

      </div>
    </>
  );
}

interface FriendProps {
  friend: Friend;
  onSelectFriend: (friend: Friend) => void;
  currentFriend: Friend | undefined;

}
function Friend({ friend, onSelectFriend, currentFriend }: FriendProps) {
  const isSplitOpen = friend.id === currentFriend?.id;

  return (
    <li>
      <div className='friend'>
        <img src={friend.photo} alt="photo"></img>
        <div>
          <h4> {friend.name}</h4>
          {
            friend.balance == 0 ?
              <h4>You and {friend.name} are even.</h4> : friend.balance > 0 ?
                <h4>{friend.name} owes you {friend.balance}.</h4> : <h4>You owe {friend.name} {Math.abs(friend.balance)}.</h4>
          }

        </div>
        <button onClick={() => onSelectFriend(friend)}> {isSplitOpen ? "Close" : "Select"} </button>
      </div>
    </li>
  )

}

interface SplitProps {
  friend: Friend;
  onSplit: (amount: number) => void;
}
function Split({ friend, onSplit }: SplitProps) {
  const [total, setTotal] = useState<number>(0);
  const [my, setMy] = useState<number>(0);
  const [whoPay, setWhoPay] = useState<string>("You");

  function handleSplitBill() {
    // 负数是我 owe 对方钱
    if (whoPay === "You") {
      const newBalance = total - my;
      onSplit(newBalance);
    }
    else {
      const newBalance = -my;
      onSplit(newBalance);
    }

  }
  return (
    <>
      <h2>Split a bill with {friend.name}</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <h4>bill value</h4>
        <input value={total} onChange={(e) => setTotal(Number(e.target.value))} />
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <h4>your expense</h4>
        <input value={my} onChange={(e) => setMy(Number(e.target.value))} />
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <h4>{friend.name}'s expense</h4>
        <input value={total - my} disabled />
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <h4>Who is paying the bill</h4>
        <select value={whoPay} onChange={(e) => setWhoPay(e.target.value)}>
          <option value="You">You</option>
          <option value="Friend">{friend.name}</option>
        </select>
      </div>

      <button onClick={handleSplitBill}>Split Bill</button>
    </>

  )

}

interface AddFriendProps {
  onAddFriend: (friend: Friend) => void;
}

function AddFriend({ onAddFriend }: AddFriendProps) {
  const [name, setName] = useState<string>("");
  const [photo, setPhoto] = useState<string>("https://i.pravatar.cc/48?u=118836");
  function handleAddFriend(e: any) {
    // form提交一定要的
    e.preventDefault();
    const id = new Date();
    const newFriend = { id: Number(id), name, photo, balance: 0 };
    onAddFriend(newFriend);
    setName("");

  }
  return (
    <>
      <form onSubmit={handleAddFriend}>
        <p>Friend Name</p>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <p>Image URL</p>
        <input value={photo} onChange={(e) => setPhoto(e.target.value)} />
        <button type='submit'> Add</button>
      </form>
    </>
  )
}
interface FriendListProps {
  children: React.ReactNode;

}
function FriendList({ children }: FriendListProps) {
  return (
    <>{children}</>
  )
}

export default App;
