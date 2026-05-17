// 这段代码实现了一个聊天消息管理器，负责：
// 发送消息
// 记录消息状态
// 失败后重试
// 把成功发送的消息加入批处理队列
// 队列满了自动 flush    batching   自动每 100 items flush 

// 建议你实现成一个 class，因为它需要保存内部状态：messages、queue、batch
// 重点覆盖：async send、状态流转、retry、batching、每 100 条自动 flush。

type MessageStatus = "sending" | "sent" | "failed" | "retrying";

type Message = {
  id: string;
  message: string;
  status: MessageStatus;
};

class ChatMessageManager {
  // store messages in a Map for efficient lookup by id 用 Map 的好处是：通过 id 查找消息很快
  private messages = new Map<string, Message>();   //消息 id -> 消息对象  因为要用id查找 所以存成map
  // 数组，用来暂存已经成功发送的消息
  private batch: Message[] = [];
  // 表示批处理队列最多放多少条消息
  private batchSize: number;

  // 默认值100  用户new的时候不传参数也没事  
  constructor(batchSize: number = 100) {
    this.batchSize = batchSize
  }

  // 异步方法，用来发送一条消息
  // 调用方式用await关键字   const msg = await manager.sendMessage("hello"); 
  // async 函数永远返回 Promise   这里返回msg所以就写成 Promise<Message>  注意这里仅仅定义成功时候的返回值类型 
  async sendMessage(text: string): Promise<Message> {
    const msg: Message = {
      id: crypto.randomUUID(),
      message: text,
      status: "sending",
    };

    // 这样之后可以通过 id 查询这条消息的状态
    this.messages.set(msg.id, msg);

    try {
      // 发送消息需要：网络请求  等服务器响应   不会立刻完成
      // 所以：sendMessage()不可能同步返回最终结果     是在“未来某个时刻” 才能拿到 msg
      // 而 JavaScript 里 “未来会得到一个值”  就是 Promise
      await this.fakeSendToServer(msg);

      msg.status = "sent";
      this.addToBatch(msg);

      // 确实返回的是一个 msg 对象  但因为这个函数被 async 修饰了 所以 js 会自动把返回值包装成 Promise
      return msg;  // 等价于 return Promise.resolve(msg);
    } catch {
      msg.status = "failed";
      return msg;
    }
  }

  async retryMessage(id: string): Promise<Message | null> {
    const msg = this.messages.get(id);

    if (!msg) return null;
    // 只有 "failed" 的消息才允许重试
    if (msg.status !== "failed") return msg;

    msg.status = "retrying";

    try {
      await this.fakeSendToServer(msg);

      msg.status = "sent";
      this.addToBatch(msg);

      return msg;
    } catch {
      msg.status = "failed";
      return msg;
    }
  }

  getMessageStatus(id: string): MessageStatus | null {
    return this.messages.get(id)?.status ?? null;
  }

  // 清空 batch
  // Once the batch reaches the configured size, it is automatically flushed
  flush(): Message[] {
    const flushed = [...this.batch];
    this.batch = [];
    return flushed;
  }

  // 成功发送的消息会被加入 batch
  private addToBatch(msg: Message): void {
    this.batch.push(msg);

    // 如果 batch 数量大于等于设定大小，就自动调用 flush()
    if (this.batch.length >= this.batchSize) {
      const flushed = this.flush();
      console.log("Auto flushed batch:", flushed.length);
    }
  }

  // 模拟发送服务器
  private async fakeSendToServer(msg: Message): Promise<void> {
    // 先等待 300 毫秒
    await new Promise((resolve) => setTimeout(resolve, 300));
    // setTimeout(resolve, 300)    300ms 后调用 resolve()   
    // resolve是 Promise 自带的一个函数。调用它表示：Promise 完成了

    // 300ms 后打印：okkk
    setTimeout(() => {
      console.log("okkk");
    }, 300);


    const success = Math.random() > 0.2;

    if (!success) {
      // 这个错误会被 sendMessage 或 retryMessage 里的 catch 捕获
      throw new Error(`Failed to send message: ${msg.id}`);
    }
  }
}


async function main() {
  const manager = new ChatMessageManager(3);

  const m1 = await manager.sendMessage("Hello");
  const m2 = await manager.sendMessage("How are you?");
  const m3 = await manager.sendMessage("This is a test");

  console.log(m1, m2, m3);

  if (m1.status === "failed") {
    await manager.retryMessage(m1.id);
  }

  console.log(manager.getMessageStatus(m1.id));
}

main();