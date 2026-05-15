import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

// 你现在最该升级的点：从“设置状态”到“派发动作”

// 你现在还在这样思考：
// 上传成功了 → 把状态改成 "success"
// retry 了 → 把状态改成 "uploading"

// 更成熟的思路应该是：

// 用户点击 Upload → 触发 startUpload
// 上传定时器成功 → 触发 uploadSuccess
// 上传定时器失败 → 触发 uploadFail
// 用户点击 Retry → 触发 retry

// 然后由一个统一的 transition 函数决定是否允许转换。

// 为什么这比“直接改状态”更重要

// 因为这样你才能表达：

// idle + startUpload -> uploading
// uploading + uploadSuccess -> success
// uploading + uploadFail -> error
// error + retry -> uploading

// 其他动作组合：

// 保持原状态
// 拒绝非法跳转

// 这才叫状态机建模。

type Status = 'idle' | 'uploading' | 'success' | 'error';

type FileAction = 'startUpload' | 'uploadSuccess' | 'uploadFail' | 'retry';

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



function App() {

  const [files, setFiles] = useState<File[]>(initialFiles);

  //把规则收拢成一个统一的转换函数
  // “受约束的状态转换函数”  不要直接传目标状态进去，而是传“动作”。
  // 当前状态 + 动作 -> 下一个状态   而不是想变成什么就直接 set 成什么status
  //  从建模角度，transition 更像一个纯业务规则函数，和组件状态没直接耦合。 所以更推荐放到App组件外

  function transition(status: Status, action: FileAction): Status {
    switch (status) {
      case 'idle':
        if (action === 'startUpload') return 'uploading';
        return status;

      case 'uploading':
        if (action === 'uploadSuccess') return 'success';
        if (action === 'uploadFail') return 'error';
        return status;

      case 'error':
        if (action === 'retry') return 'uploading';
        return status;

      case 'success':
        return status;
    }
  }

  //统一更新
  //   UI 不直接改状态
  // effect 不直接改状态
  // 所有变化都经过统一规则
  function dispatchFileAction(id: number, action: FileAction) {
    setFiles(prev =>
      prev.map(file =>
        file.id === id
          ? { ...file, fileStatus: transition(file.fileStatus, action) }
          : file
      )
    );
  }


  return (
    <>
      <ul>
        {files.map(f => <FileItem key={f.id} file={f} onUpdate={dispatchFileAction} />)}
      </ul>
    </>

  )
}

interface FileItemProps {
  file: File;
  onUpdate: (id: number, action: FileAction) => void;
}
function FileItem({ file, onUpdate }: FileItemProps) {

  useEffect(() => {
    if (file.fileStatus !== "uploading") return;

    const timer = setTimeout(() => {
      const random = Math.random();  //生成 [0, 1) 的随机数
      if (random <= 0.8) {
        onUpdate(file.id, 'uploadSuccess')
      }
      else {
        onUpdate(file.id, 'uploadFail')

      }
    }, 2000)

    return () => {
      clearTimeout(timer)
    }
  }, [file.fileStatus, file.id, onUpdate])

  return (
    <>
      <li>
        <div>{file.name} is {file.fileStatus}!
          {
            file.fileStatus === "error" ?
              < button onClick={() => onUpdate(file.id, 'retry')}>Retry</button> :
              <button
                onClick={() => onUpdate(file.id, 'startUpload')}
                disabled={file.fileStatus === "success" || file.fileStatus === "uploading"}>
                Upload</button>
          }
        </div>
      </li>

    </>
  )

}



export default App;
