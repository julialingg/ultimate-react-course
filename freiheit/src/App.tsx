// Merge Data Sources
const employees = [
  { company: "BMW", employees: 1000 }
];

const revenues = [
  { company: "BMW", revenue: 5000 }
];

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
function mergeUserProfiles(users: Userr[], settings: UserSettings[]): UserProfile[] {
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

  return (
    <div>

    </div>
  );
}
export default App;
