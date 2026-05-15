import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

// 文件上传状态机（Upload Manager）纯建模能力  彻底训练“状态流转正确性”
// 每个文件必须有状态：
// idle → uploading → success
//                  ↘ error
// 🧩 页面功能
// 1️⃣ 选择文件
// 	• 模拟添加文件 (button)
// 	• 每个文件独立

// 2️⃣ 上传按钮
// 点击上传后：
// 	• 状态从 idle → uploading
// 	• 模拟 2 秒后：
// 		○ 80% 成功 → success
// 		○ 20% 失败 → error

// 🔁 重试机制（重点）
// 如果状态是 error：
// 	• 必须可以点击 Retry 再次进入 uploading



// 🚫 限制（重点）
// 	• ❌ uploading 状态下不能重复点击上传 
// 	• ❌ 不允许一个文件同时有多个“上传过程”
// 	• ❌ 不允许状态跳跃（例如 idle → success）

// 🧪 验收标准
// 	• 不会出现重复上传
// 	• retry 正常
// 	• 状态与 UI 始终一致 


type Status = 'idle' | 'uploading' | 'success' | 'error';

const initialFiles: File[] = [
  { id: 1, name: "file 1", fileStatus: "idle" },
  { id: 2, name: "file 2", fileStatus: "idle" },
  { id: 3, name: "file 3", fileStatus: "idle" },
  { id: 4, name: "file 4", fileStatus: "idle" },
  { id: 5, name: "file 5", fileStatus: "idle" },
  { id: 6, name: "file 6", fileStatus: "idle" },
  { id: 7, name: "file 7", fileStatus: "idle" },
  { id: 8, name: "file 8", fileStatus: "idle" },
  { id: 9, name: "file 9", fileStatus: "idle" },
  { id: 10, name: "file 10", fileStatus: "idle" },

]
type File = {
  id: number;
  name: string;
  fileStatus: Status;
}

// 这一版本 你已经会写“状态值”，但还没有真正写出“状态转换规则”
// 真正状态机应该是：当前状态 +动作  =合法下一状态
// 而不是： 想变成什么就直接 set 成什么

function App() {

  const [files, setFiles] = useState<File[]>(initialFiles);


  function handleUpload(id: number) {
    // 这种写法不好  有一点“闭包读当前 state”的味道 
    //  这个能工作，但更稳的做法是把“判断”和“更新”都放进同一个 setFiles(prev => ...) 里。

    // 因为你现在是先读了外部的 files，再做更新。虽然这个题不复杂，问题不大，
    // 但从风格上讲，如果更新依赖当前状态，最好都在函数式更新里完成。

    // const file = files.find(f => f.id === id);
    // if (file?.fileStatus !== "idle") return;
    // setFiles(prev => prev.map(f => f.id === file.id ? { ...f, fileStatus: "uploading" } : f))

    // 更好的写法：这样逻辑更封闭，不依赖 render 时闭包里的 files。
    setFiles(prev =>
      prev.map(file =>
        file.id === id && file.fileStatus === 'idle'
          ? { ...file, fileStatus: 'uploading' }
          : file
      )
    );


  }

  function handleUpdate(status: Status, id: number) {
    const file = files.find(f => f.id === id);
    if (file?.fileStatus !== "uploading") return;

    setFiles(prev => prev.map(f => f.id === id ? { ...f, fileStatus: status } : f));
  }

  function handleRetry(id: number) {
    const file = files.find(f => f.id === id);
    if (file?.fileStatus !== "error") return;
    // 再次进入 uploading 状态
    setFiles(prev => prev.map(f => f.id === id ? { ...f, fileStatus: "uploading" } : f));


  }

  return (
    <>

      <ul>
        {files.map(f => <FileItem key={f.id} file={f} onUpdateStatus={handleUpdate} onRetry={handleRetry} onUpload={handleUpload} />)}
      </ul>
    </>

  )
}

interface FileItemProps {
  file: File;
  onUpdateStatus: (status: Status, id: number) => void;
  onRetry: (id: number) => void;
  onUpload: (id: number) => void;

}
function FileItem({ file, onUpdateStatus, onRetry, onUpload }: FileItemProps) {

  useEffect(() => {
    if (file.fileStatus !== "uploading") return;

    const timer = setTimeout(() => {
      const random = Math.random();  //生成 [0, 1) 的随机数
      if (random <= 0.8) {
        onUpdateStatus("success", file.id)
      }
      else {
        onUpdateStatus("error", file.id)
        //你是疯了吗在子组件直接改file的property。。。。
        // file.fileStatus = "error"
      }
    }, 2000)

    return () => {
      clearTimeout(timer)
    }
  }, [file.fileStatus])

  return (
    <>
      <li>
        <div>{file.name} is  {file.fileStatus}
          {
            file.fileStatus === "error" ?
              < button onClick={() => onRetry(file.id)}>Retry</button> :
              <button onClick={() => onUpload(file.id)} disabled={file.fileStatus === "success" || file.fileStatus === "uploading"}>Upload</button>
          }
        </div>
      </li>

    </>
  )

}



export default App;
