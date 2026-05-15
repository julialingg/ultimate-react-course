// 数据处理 pipeline 思维
// 1. validate
// 2. deduplicate
// 3. group
// 4. aggregate
// 5. summarize

const orders: Order[] = [
  {
    customerId: "c1",
    product: "MacBook",
    amount: 2400,
    status: "paid",
    createdAt: "2025-08-01T10:00:00Z",
  },

  {
    customerId: "c1",
    product: "iPhone",
    amount: 1200,
    status: "pending",
    createdAt: "2025-08-02T11:00:00Z",
  },

  {
    customerId: "c1",
    product: "iPhone",
    amount: 1200,
    status: "paid",
    createdAt: "2025-08-03T12:00:00Z",
  },

  // duplicate
  {
    customerId: "c1",
    product: "iPhone",
    amount: 1200,
    status: "paid",
    createdAt: "2025-08-03T12:00:00Z",
  },

  {
    customerId: "c2",
    product: "AirPods",
    amount: 250,
    status: "paid",
    createdAt: "2025-08-01T09:00:00Z",
  },

  {
    customerId: "c2",
    product: "iPad",
    amount: 800,
    status: "cancelled",
    createdAt: "2025-08-02T09:30:00Z",
  },

  {
    customerId: "c2",
    product: "iPad",
    amount: 850,
    status: "paid",
    createdAt: "2025-08-03T14:00:00Z",
  },

  // invalid amount
  {
    customerId: "c2",
    product: "Apple Watch",
    amount: null,
    status: "pending",
    createdAt: "2025-08-04T15:00:00Z",
  },

  {
    customerId: "c3",
    product: "Monitor",
    amount: 400,
    status: "paid",
    createdAt: "2025-08-01T16:00:00Z",
  },

  {
    customerId: "c3",
    product: "Keyboard",
    amount: 100,
    status: "paid",
    createdAt: "2025-08-02T17:00:00Z",
  },

  // invalid date
  {
    customerId: "c3",
    product: "Mouse",
    amount: 60,
    status: "pending",
    createdAt: "invalid-date",
  },

  {
    customerId: "c3",
    product: "Monitor",
    amount: 450,
    status: "paid",
    createdAt: "2025-08-05T10:00:00Z",
  },

  {
    customerId: "c4",
    product: "Gaming Chair",
    amount: 700,
    status: "pending",
    createdAt: "2025-08-01T08:00:00Z",
  },

  {
    customerId: "c4",
    product: "Gaming Chair",
    amount: 700,
    status: "paid",
    createdAt: "2025-08-02T08:00:00Z",
  },

  {
    customerId: "c4",
    product: "Desk",
    amount: 350,
    status: "paid",
    createdAt: "2025-08-03T08:00:00Z",
  },
];

type Order = {
  customerId: string;
  product: string;
  amount: number | null;
  status: "pending" | "paid" | "cancelled";
  createdAt: string;
};

type CustomerSummary = {
  customerId: string;
  products: string[];
  // 每个 product 最新的 status
  latestStatus: Record<string, string>;  // key是product
  averageOrderAmount: Record<string, number>; //平均订单金额。
  invalidOrders: number;
};

function isValid(order: Order): boolean {
  if (order.amount === null) return false;
  const time = new Date(order.createdAt).getTime();
  if (Number.isNaN(time)) return false;

  return true;
}

function createKey(order: Order): string {
  return `${order.customerId}-${order.product}-${order.createdAt}`
}

function deduplicateOrders(orders: Order[]): Order[] {
  const results: Order[] = []
  const seen = new Set<string>();

  for (const item of orders) {
    const key = createKey(item)
    if (!seen.has(key)) {
      seen.add(key)
      results.push(item)
    }
  }

  return results

}

function groupByCustomerId(orders: Order[]): Map<string, Order[]> {
  const results = new Map<string, Order[]>();

  for (const order of orders) {
    // TODO 错的！！！
    // if (results.get(order.customerId)===undefined){
    //   results.get(order.customerId)
    // }


    if (!results.has(order.customerId)) results.set(order.customerId, [])
    results.get(order.customerId)?.push(order)
  }
  return results
}

// 给每一个order 构建自己的summary
function buildSummary(customerId: string, orders: Order[]): CustomerSummary {

  let invalidOrders = 0;
  const products = new Set<string>();


  // 每个 product 最新的 status
  // key是product
  const latestStatus: Record<string, string> = {}
  const latestStatusTime: Record<string, number> = {}



  const spentSums: Record<string, number> = {}
  const spentCounts: Record<string, number> = {}
  const averageOrderAmount: Record<string, number> = {}

  for (const item of orders) {
    if (!isValid(item)) {
      invalidOrders++
      continue;
    }
    products.add(item.product)


    const time = new Date(item.createdAt).getTime();
    if (latestStatusTime[item.product] === undefined || time > latestStatusTime[item.product]) {
      latestStatusTime[item.product] = time;
      latestStatus[item.product] = item.status
    }

    if (item.amount !== null) {
      // 写错：  必须加括号
      // spentSums[item.product] = spentSums[item.product] ?? 0 + spentSums[item.product]
      // spentCounts[item.product] = spentCounts[item.product] ?? 0 + spentCounts[item.product]
      spentSums[item.product] = (spentSums[item.product] ?? 0) + item.amount
      spentCounts[item.product] = (spentCounts[item.product] ?? 0) + 1
    }

  }

  for (const key in spentSums) {
    averageOrderAmount[key] = spentSums[key] / spentCounts[key]
  }

  return {
    customerId,
    products: Array.from(products).sort(),
    latestStatus,
    averageOrderAmount,
    invalidOrders

  }

}

function generateSummary(data: Order[]): CustomerSummary[] {

  const deduplicate = deduplicateOrders(data);
  const grouped = groupByCustomerId(deduplicate)
  const results: CustomerSummary[] = []
  grouped.forEach((orders, id) => {
    results.push(buildSummary(id, orders))
  })

  return results
}

export default generateSummary;