
const users = [
  "alice",
  "bob",
  "alice",
  "charlie",
  "bob",
  "alice",
  "bob",
  "alice",
  "charlie",
  "bob",
  "alice",
  "ling",
  "ming",
  "ming"
];
function countUsers(users: string[]): Record<string, number> {
  const result: Record<string, number> = {}

  // 第一次遇到：user = "alice 的时候result["alice"] 会是：undefined
  for (const user of users) {
    // undefined 判断不存在
    if (result[user] === undefined) {
      result[user] = 1;
      continue;
    }
    result[user]++
  }

  // 更简洁的方式：
  // for (const user of users) {
  //   result[user] = (result[user] ?? 0) + 1;
  // }
  return result
}

const tags = [
  "react",
  "ts",
  "react",
  "frontend",
  "ts"
];
// 去重  立刻想到set！！！
function uniqueTags(data: string[]): string[] {
  const tags = new Set<string>();
  for (const item of data) {
    tags.add(item)
  }

  // 这里需要转array是因为返回类型是string[]     tags本身的类型是Set<string>
  //   把 Set 转回 Array: 常见方式：Array.from(tags)或者：[...tags]

  // 这里其实有一个很重要的工程思维：Set 常用于“中间处理过程”
  // 因为它：自动去重  lookup O(1)
  // 但：最终 API / function output  通常还是：array
  return Array.from(tags)


  //你可以记一个高频 pattern：给array去重然后return去重后的array
  // const set = new Set(array类型数据);
  // return [...set];


}


type Product = {
  name: string;
  category: string;
}
const products = [
  { name: "iPhone", category: "electronics" },
  { name: "MacBook", category: "electronics" },
  { name: "Sofa", category: "furniture" }
];

// 类别分组（Map + Record）
// 输出：
// {
//   electronics: ["iPhone", "MacBook"],
//   furniture: ["Sofa"]
// } 

function groupByCategory(products: Product[]): Record<string, string[]> {
  // Record 初始化 写法
  const grouped: Record<string, string[]> = {}
  for (const item of products) {
    // 也可以这样写：grouped[item.category] === undefined   
    // 但是！更短更常见
    if (!grouped[item.category]) {
      grouped[item.category] = []

    }
    grouped[item.category].push(item.name)
  }
  return grouped;

  // grouping pattern！！！

  // 以后看到：  按某个字段分类

  // 脑子应该立刻出现：
  // Record<string, T[]>

  // 然后：

  // if (!obj[key]) {
  //   obj[key] = []
  // }


}

// 进一步的group练习： nested grouping
type Order = {
  country: string;
  status: string;
}
const orders = [
  { country: "DE", status: "paid" },
  { country: "DE", status: "pending" },
  { country: "US", status: "paid" },
  { country: "DE", status: "paid" }
];

// {
//   DE: {
//     paid: 2,
//     pending: 1
//   },
//   US: {
//     paid: 1
//   }
// }

function groupByCountry(orders: Order[]): Record<string, Record<string, number>> {

  const grouped: Record<string, Record<string, number>> = {};
  for (const item of orders) {

    // 第一层：country
    if (!grouped[item.country]) {
      grouped[item.country] = {}
    }

    // 不需要中间数组DE -> ["paid", "pending", "paid"]    直接count就行！！ 
    // grouped[item.country].push(item.status)

    // 第二层：status
    if (!grouped[item.country][item.status]) {
      grouped[item.country][item.status] = 0;
    }

    grouped[item.country][item.status]++
  }

  // const counts = 
  // for (const key in grouped) {
  //   grouped[key] = 

  // }

  return grouped;
}

type RecordItem = {
  company: string;
  value: number;
  // ts是timestamp
  ts: number;
}
const records = [
  { company: "BMW", value: 100, ts: 1 },
  { company: "BMW", value: 200, ts: 2 },
  { company: "Tesla", value: 300, ts: 5 },
  { company: "Tesla", value: 300, ts: 15 },
  { company: "Acta", value: 300, ts: 15 }
];
// 保留 timestamp 最大的
function latestRecords(records: RecordItem[]): Record<string, RecordItem> {
  const results: Record<string, RecordItem> = {}
  const latestTime: Record<string, number> = {}

  for (const item of records) {
    const time = item.ts
    if (!latestTime[item.company] || time > latestTime[item.company]) {
      latestTime[item.company] = time
      results[item.company] = item
    }
  }
  return results
}



const logs = [
  { level: "error" },
  { level: "info" },
  { level: "error" },
  { level: "warn" }
];

function calculateCounts(logs: any): Record<string, number> {
  const results: Record<string, number> = {}
  for (const log of logs) {

    // if (!results[log.level]) {
    //   results[log.level] = 0
    // }

    // results[log.level]++

    //更简洁的：
    results[log.level] = (results[log.level] ?? 0) + 1;
  }

  return results
}

type User = {
  id: number;
  name: string
}
const ussers = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];
// 转成：用  id 当 key
// {
//   1: { id: 1, name: "Alice" },
//   2: { id: 2, name: "Bob" }
// }
function normalize(users: User[]): Record<number, User> {
  const results: Record<string, User> = {}
  for (const user of users) {
    results[user.id] = user
  }
  return results
}

// 过滤invalid的data 
const rows = [
  { company: "BMW", revenue: 100 },
  { company: "", revenue: 200 },
  { company: "Tesla", revenue: null }
];
type Row = {
  company: string;
  // 因为数据里revenue有null，所以不能只定义number
  revenue: number | null;
}

//输出是
// [
//   { company: "BMW", revenue: 100 }
// ]

function filterInvalidData(rows: Row[]): Row[] {
  const results: Row[] = [];
  // 空字符串？ 怎么判断 ？ Boolean("")是false  所以直接row.company 就能过滤空字符串了
  for (const row of rows) {
    if (row.company && typeof row.revenue === "number") {
      results.push(row)
    }
  }
  return results
}

function filterInvalidData2(rows: Row[]): Row[] {
  return rows.filter(
    row => row.company && typeof row.revenue === "number"
  );
}

// Merge Data Sources
const employees = [
  { company: "BMW", employees: 1000 }
];

const revenues = [
  { company: "BMW", revenue: 5000 }
];

// [
//   {
//     company: "BMW",
//     employees: 1000,
//     revenue: 5000
//   }
// ]
type CompanyData = {
  company: string;
  employees: number;
  revenue: number;
}
type CompanyEmployee = {
  company: string;
  employees: number;
}
type CompanyRevenue = {
  company: string;
  revenue: number;
}
function mergeCompanyData(employees: CompanyEmployee[], revenue: CompanyRevenue[]): CompanyData[] {

  const revenueMap = new Map<string, number>()

  for (const item of revenue) {
    revenueMap.set(item.company, item.revenue)
  }


  const results: CompanyData[] = [];

  for (const employee of employees) {

    const companyRevenue = revenueMap.get(employee.company);

    // 类型是number的时候 不能用  (!revenueMap.get()) 来判断了。因为数字0 也是false  必须用！==undefined
    if (companyRevenue === undefined) {
      continue;
    }

    results.push({
      company: employee.company,
      employees: employee.employees,
      revenue: companyRevenue,
    });
  }

  // 很多 junior 容易：
  // map + return []
  // 其实：map 不适合做 filtering。

  //  CompanyData[] = employees.map(e => {

  //   if (!revenueMap.get(e.company)) {
  //     return  {}
  //   }

  //   return {
  //     company: e.company,
  //     employees: e.employees,
  //     revenue: revenueMap.get(e.company)
  //   }

  // })

  return results
}



// Merge User Profiles
type Userr = {
  id: number;
  name: string;
};

type UserSettings = {
  id: number;
  theme: string;
};

type UserProfile = {
  id: number;
  name: string;
  theme: string;
};

const userrrs = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

const settings = [
  { id: 1, theme: "dark" },
  { id: 2, theme: "light" },
];

// 要求
// 	• 只返回有 settings 的用户 
// 	• 用 Map 做 lookup 
// 	• 不允许 O(n²) 

function mergeUserProfiles(users: User[], settings: UserSettings[]): UserProfile[] {
  // 用 Map 做 lookup   
  const settingsMap = new Map<number, string>()
  for (const item of settings) {
    settingsMap.set(item.id, item.theme)
  }

  const results: UserProfile[] = []

  for (const item of users) {
    const theme = settingsMap.get(item.id)
    // undefined handling 
    if (theme === undefined) continue;

    results.push({
      id: item.id,
      name: item.name,
      theme: theme
    })


  }

  return results

}



// Latest Status Per Order
// “latest record” pattern
type OrderEvent = {
  orderId: string;
  status: string;
  timestamp: number;
};

const events = [
  {
    orderId: "A1",
    status: "created",
    timestamp: 1,
  },
  {
    orderId: "A1",
    status: "paid",
    timestamp: 3,
  },
  {
    orderId: "A1",
    status: "shipped",
    timestamp: 5,
  },
  {
    orderId: "B2",
    status: "created",
    timestamp: 2,
  },
  {
    orderId: "B2",
    status: "cancelled",
    timestamp: 4,
  },
];


function latestOrderStatus(events: OrderEvent[]): Record<string, OrderEvent> {
  const latestTime: Record<string, number> = {};
  const results: Record<string, OrderEvent> = {}
  for (const item of events) {
    const time = item.timestamp;
    // 判断是否存在 用undefined
    if (latestTime[item.orderId] === undefined || time > latestTime[item.orderId]) {
      latestTime[item.orderId] = time;
      results[item.orderId] = item;

    }
  }
  return results


}

function latestOrderStatus2(events: OrderEvent[]): Record<string, OrderEvent> {

  const results: Record<string, OrderEvent> = {};

  for (const item of events) {

    const existing = results[item.orderId];

    if (
      existing === undefined ||
      item.timestamp > existing.timestamp
    ) {
      results[item.orderId] = item;
    }
  }

  return results;
}




function App() {


  console.log(mergeUserProfiles(userrrs, settings))
  return (
    <div>

    </div>
  );
}
export default App;
