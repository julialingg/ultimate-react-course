// Event Processing Pipeline


// This problem focuses on:

// event processing
// state transitions
// clean TypeScript logic
// edge case handling
// data transformation
// maintainable code structure



// TypeScript 类型通常大写。
type event = {
  userId: string
  type: "LOGIN" | "PURCHASE" | "LOGOUT"
  timestamp: number
}

const events: event[] = [
  { userId: "u1", type: "LOGIN", timestamp: 10 },
  { userId: "u1", type: "PURCHASE", timestamp: 15 },
  { userId: "u1", type: "LOGOUT", timestamp: 20 },

  { userId: "u2", type: "LOGIN", timestamp: 5 },
  { userId: "u2", type: "LOGOUT", timestamp: 25 },
];


function validateInput(event: event): boolean {
  // !!event.timestamp 会把 timestamp: 0 判断成 false
  // return !!event.userId && !!event.timestamp && (event.type === "LOGIN" || event.type === "LOGOUT" || event.type === "PURCHASE")
  return !!event.userId && typeof event.timestamp === "number"
    && Number.isFinite(event.timestamp)
    && (event.type === "LOGIN" || event.type === "LOGOUT" || event.type === "PURCHASE")

}

// Adds a new event into the event list.
function addEvent(events: event[], event: event): event[] {
  if (!validateInput(event)) return events

  // const newEvents = events.push(event)
  const newEvents = [...events, event]
  return newEvents

}

// Important Edge Case     Your implementation should handle:
// unordered events
// duplicate LOGIN events
// LOGOUT without LOGIN
// users with no sessions
// overlapping invalid states

// Returns total logged-in session time.
function getUserSessionTime(events: event[], userId: string): number {
  // Session Rules
  // LOGIN starts a session
  // LOGOUT ends a session
  // Ignore invalid sequences:
  //     duplicate LOGIN
  //     LOGOUT without LOGIN

  // sort是为了按时间排序    a.timestamp - b.timesta 是 JS/TS 里最常见的数字升序 
  const userEvents: event[] = events.filter(e => e.userId === userId).sort((a, b) => a.timestamp - b.timestamp);

  // 不能用次数相等来判断:
  // for (const e of userEvents) {
  //   let loginTimes: number = 0
  //   let logoutTimes: number = 0

  //   if (e.type === "LOGIN") loginTimes++
  //   if (e.type === "LOGOUT") logoutTimes++
  // }


  let totalTime = 0;
  //currentLoginTime   初始化赋值为null
  let currentLoginTime: number | null = null;
  for (const e of userEvents) {
    if (e.type === "LOGIN") {
      // only accept LOGIN if user is currently logged out
      if (currentLoginTime === null) {
        currentLoginTime = e.timestamp
      }
    }


    if (e.type === "LOGOUT") {
      // only accept LOGOUT if user is currently logged in
      if (currentLoginTime !== null) {
        totalTime += e.timestamp - currentLoginTime
        // 必须清空 不然下一对login out没办法算了.
        currentLoginTime = null
      }

    }
  }

  return totalTime;
}
// Returns the number of purchases for a user.
function getPurchaseCount(events: event[], userId: string): number {

  // const userEvents: event[] = events.filter(e => e.userId === userId)

  // let count: number = 0
  // for (const e of userEvents) {
  //   if (e.type == "PURCHASE") {
  //     count++
  //   }

  // }
  // return count

  // 更简单的方式：
  return events.filter(
    (e) => e.userId === userId && e.type === "PURCHASE"
  ).length;

}


// Returns the top n users with the highest total session time.
function getTopActiveUsers(events: event[], n: number): string[] {
  // const users: string[] = events.map(e => e.userId);
  // 一个 user 会出现很多次 event。  所以用set去重  否则后面排序的结果也可能被影响
  const users = Array.from(new Set(events.map(e => e.userId)));

  // 这种结构很难sort 因为key不固定
  // const activeTime: Record<string, number>[] = []
  const activeTime: {
    userId: string;
    totalTime: number;
  }[] = [];

  for (const user of users) {
    const time = getUserSessionTime(events, user);
    // TODO  record []如何赋值
    // activeTime.push({ [user]: time })
    activeTime.push({ userId: user, totalTime: time })
  }

  // 降序
  activeTime.sort((a, b) => b.totalTime - a.totalTime)

  // slice 取前 n 个元素
  return activeTime.slice(0, n).map(user => user.userId)


}
export default getTopActiveUsers