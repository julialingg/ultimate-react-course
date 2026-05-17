// an In-Memory Task Scheduler  任务调度器

type Task = {
  id: string;
  priority: number;
  order: number;
};


//  规则：
// 	• priority 越大越优先 
// 	• 相同 priority 按加入顺序执行（FIFO） 
// 	• cancel 后不能执行 
// 	• executeNext 返回下一个 taskId 
// 没有任务时返回 null 


class TaskScheduler {

  private tasks: Task[] = [];
  //作用 记录任务加入的先后顺序（FIFO） 显式记录：谁先加入  可以理解成时间戳 只是没用真实时间而已
  private orderCounter = 0;

  addTask(taskId: string, priority: number): void {
    const task: Task = {
      id: taskId,
      priority,
      order: this.orderCounter,
    };

    this.tasks.push(task);
    this.orderCounter++;
  }

  executeNext(): string | null {
    if (this.tasks.length === 0) {
      return null;
    }

    this.tasks.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority; // higher priority first
      }

      return a.order - b.order; // earlier task first
    });

    //删除并返回数组的第一个元素
    const nextTask = this.tasks.shift();


    // 如果数组为空 shift没取到元素 就返回null
    return nextTask ? nextTask.id : null;
  }

  cancelTask(taskId: string): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }

  // 返回当前所有“还没执行、也没被取消”的任务列表
  //  按priority 排序   priority 相同按加入顺序排序（FIFO）
  // 最终只返回 task id 列表。
  getPendingTasks(): string[] {

    // this.tasks.slice()  复制整个数组
    return this.tasks
      .slice()
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          // 降序
          return b.priority - a.priority;
        }

        return a.order - b.order;
      })
      .map(task => task.id);
  }
}

// ===== TEST =====

// 创建 scheduler 实例
const taskScheduler = new TaskScheduler();

// 调用方法
taskScheduler.addTask("A", 1);
taskScheduler.addTask("B", 3);
taskScheduler.addTask("C", 3);

console.log(taskScheduler.getPendingTasks());
// ["B", "C", "A"]

console.log(taskScheduler.executeNext());
// B

console.log(taskScheduler.executeNext());
// C

taskScheduler.cancelTask("A");

console.log(taskScheduler.executeNext());