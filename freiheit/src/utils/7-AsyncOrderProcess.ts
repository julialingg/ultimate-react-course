// 异步订单验证流程

// 你会练到：
// async/await
// try/catch
// Promise
// sequential async flow
// conditional validation

type Order = {
  id: number;
  item: string;
  paid: boolean;
  inStock: boolean;
};

async function fetchOrder(orderId: number): Promise<Order> {
  return {
    id: orderId,
    item: "Laptop",
    paid: true,
    inStock: true,
  };
}

async function validateStock(order: Order): Promise<boolean> {
  return order.inStock;
}

async function validatePayment(order: Order): Promise<boolean> {
  return order.paid;
}


// 注意这里仅仅定义成功时候的返回值类型  Promise<string>
async function processOrder(orderId: number): Promise<string> {
  //   workflow：
  // 异步获取订单
  // 异步验证库存
  // 异步验证支付状态
  // 如果都成功：  返回 "Order confirmed"
  // 否则： throw error

  try {
    const order = await fetchOrder(orderId);

    const hasStock = await validateStock(order);
    const isPaid = await validatePayment(order)
    //用early return 先把异常情况处理了 early failure handling 也叫guard clauses
    // 先把不合法/异常情况提前退出。
    // 这样：不会进入后面的正常逻辑
    // 减少 nested if  flow 更清晰

    if (!hasStock) {
      throw new Error("Item out of stock");
    }

    if (!isPaid) {
      throw new Error("Payment not completed");
    }

    return "Order confirmed"
  } catch (e) {

    throw new Error(`Order processing failed: ${e}`)
  }


  // sequential workflow 是什么？   一步一步、按顺序执行的流程。

  // const order = await fetchOrder(orderId);
  // const hasStock = await validateStock(order);
  // const isPaid = await validatePayment(order);

  // 就是sequential async flow  因为每一步都依赖前一步结果




}