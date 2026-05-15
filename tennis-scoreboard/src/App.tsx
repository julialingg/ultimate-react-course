import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

// 一个任务（Task）有状态：

// todo → in_progress → done
// 规则：
// 	• todo → in_progress（点击 start） 
// 	• in_progress → done（点击 finish）   done 不能再变 
//    in_progress + cancel → todo

// 这是你最缺的能力： 把业务规则变成数据结构

// 3种按钮
type Action = 'start' | 'finish' | 'cancel';
type Status = 'todo' | 'inProgress' | 'Done';

function transition(status: Status, action: Action): Status {
  switch (status) {
    case 'todo':
      if (action === 'start') return 'inProgress'
      return status
    case 'inProgress':
      if (action === 'finish') return 'Done'
      if (action === 'cancel') return 'todo'
      return status
    case 'Done':
      return status
  }
}

type Todo = {
  id: number;
  name: string;
  status: Status;
}


const initialTodoList: Todo[] = [
  { id: 1, name: "thing 1", status: "todo" },
  { id: 2, name: "thing 2", status: "todo" },
  { id: 3, name: "thing 3", status: "todo" },

]
function App() {
  const [todos, setTodos] = useState<Todo[]>(initialTodoList)


  //    dispatchTodoAction/handleAction  是更合适的函数名字
  function handleUpdate(id: number, action: Action) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, status: transition(t.status, action) } : t))

  }



  return (
    <>
      <ul>
        {todos.map(todo => <TodoItem key={todo.id} todo={todo} onUpdate={handleUpdate} />)}
      </ul>
    </>

  )

}

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, action: Action) => void;
}
function TodoItem({ todo, onUpdate }: TodoItemProps) {
  return (
    <>
      <li>
        <div>
          {todo.name} is {todo.status} status

          <button
            onClick={() => onUpdate(todo.id, 'start')}
            disabled={todo.status !== 'todo'}>  Start  </button>
          <button
            onClick={() => onUpdate(todo.id, 'finish')}
            disabled={todo.status !== 'inProgress'}> Finish </button>
          <button
            onClick={() => onUpdate(todo.id, 'cancel')}
            disabled={todo.status !== 'inProgress'}> Cancel </button>
        </div>
      </li>
    </>
  )
}



export default App;
