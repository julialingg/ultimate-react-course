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
// 	• 必须可以点击 Retry
// 	• 再次进入 uploading

// 🚫 限制（重点）
// 	• ❌ uploading 状态下不能重复点击上传 
// 	• ❌ 不允许一个文件同时有多个“上传过程”
// 	• ❌ 不允许状态跳跃（例如 idle → success）

// 🧪 验收标准
// 	• 不会出现重复上传
// 	• retry 正常
// 	• 状态与 UI 始终一致 


type Status = 'idle' | 'uploading' | 'success' | 'error';
type File = {
  id: number;
  name: string;
  fileStatus: Status;
}


// 还没有真正做到“状态机建模”。 现在更像是“我用几个状态字符串在跑流程”，还不是“我在严格约束合法状态流转”。

function App() {

  const [files, setFiles] = useState<File[]>([]);
  const id = useRef(0);

  function handleUpload() {
    id.current++;
    setFiles(prev => [...prev, { id: id.current, name: `file ${id.current} `, fileStatus: "uploading" }]);
  }


  // 没有真正限制“合法状态转换”
  //   这个函数的问题是： 允许任何状态跳到任何状态。
  // 但题目明明要求： 不允许状态跳跃    不允许非法转换

  //   你现在是： 这个字段可以取几个值
  // 真正状态机是： 这个字段在当前值下，只允许去某几个下一步
  function handleUpdate(status: Status, id: number) {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, fileStatus: status } : f));
  }

  function handleRetry(id: number) {
    // 再次进入 uploading 状态
    setFiles(prev => prev.map(f => f.id === id ? { ...f, fileStatus: "uploading" } : f));


  }

  return (
    <>
      <button onClick={handleUpload}>Upload</button>
      <ul>
        {files.map(f => <FileItem key={f.id} file={f} onUpdateStatus={handleUpdate} onRetry={handleRetry} />)}
      </ul>
    </>

  )
}

interface FileItemProps {
  file: File;
  onUpdateStatus: (status: Status, id: number) => void;
  onRetry: (id: number) => void;

}
function FileItem({ file, onUpdateStatus, onRetry }: FileItemProps) {

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

      return () => {
        clearTimeout(timer)
      }
    }, 2000)
  }, [file.fileStatus])

  return (
    <>
      <li>
        <div>{file.name} is  {file.fileStatus}
          {
            file.fileStatus === "error" && < button onClick={() => onRetry(file.id)}>Retry</button>
          }
        </div>
      </li>

    </>
  )

}



export default App;
