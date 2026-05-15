type Task = {
  id: string;
  priority: number;
  order: number;
};

class TaskScheduler {
  private tasks: Task[] = [];
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

    const nextTask = this.tasks.shift();

    return nextTask ? nextTask.id : null;
  }

  cancelTask(taskId: string): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }

  getPendingTasks(): string[] {
    return this.tasks
      .slice()
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }

        return a.order - b.order;
      })
      .map(task => task.id);
  }
}