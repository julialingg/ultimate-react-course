const logs: UserAction[] = [
  {
    userId: "u1",
    platform: "ios",
    action: "watch_video",
    duration: 30,
    createdAt: "2025-08-01T10:00:00Z",
  },

  {
    userId: "u1",
    platform: "web",
    action: "watch_video",
    duration: 50,
    createdAt: "2025-08-02T10:00:00Z",
  },

  {
    userId: "u1",
    platform: "android",
    action: "like_post",
    duration: 5,
    createdAt: "2025-08-03T10:00:00Z",
  },

  // duplicate
  {
    userId: "u1",
    platform: "android",
    action: "like_post",
    duration: 5,
    createdAt: "2025-08-03T10:00:00Z",
  },

  {
    userId: "u2",
    platform: "web",
    action: "watch_video",
    duration: 100,
    createdAt: "2025-08-01T12:00:00Z",
  },

  {
    userId: "u2",
    platform: "ios",
    action: "share_post",
    duration: 20,
    createdAt: "2025-08-02T09:00:00Z",
  },

  // invalid duration
  {
    userId: "u2",
    platform: "ios",
    action: "share_post",
    duration: null,
    createdAt: "2025-08-03T09:00:00Z",
  },

  // invalid date
  {
    userId: "u3",
    platform: "android",
    action: "watch_video",
    duration: 60,
    createdAt: "invalid-date",
  },

  {
    userId: "u3",
    platform: "web",
    action: "watch_video",
    duration: 80,
    createdAt: "2025-08-04T09:00:00Z",
  },

  {
    userId: "u3",
    platform: "web",
    action: "comment",
    duration: 10,
    createdAt: "2025-08-05T09:00:00Z",
  },
];

type UserAction = {
  userId: string;
  platform: "ios" | "android" | "web";
  action: string;
  duration: number | null;
  createdAt: string;
};

type UserSummary = {
  userId: string;
  platforms: string[];
  latestActions: Record<string, number>;
  averageDurations: Record<string, number>;
  invalidLogs: number;
};

//  面试官可能追问：
// 	• 如果数据量很大怎么办？ 
// 	• 如果 timestamp 相同但 value 不同怎么办？ 
// 	• 你的时间复杂度是多少？ 
// 	• 你怎么让这个函数更容易测试？


function isValid(data: UserAction): boolean {

  if (data.duration === null) return false;
  const time = new Date(data.createdAt).getTime();
  if (Number.isNaN(time)) return false;

  return true;

}

function createKey(data: UserAction): string {
  return `${data.userId}-${data.platform}-${data.action}-${data.createdAt}`
}

function deduplicateAction(data: UserAction[]): UserAction[] {
  // const seen : Set<string>=[];  不是这么写的 大姐!!!

  const seen = new Set<string>();
  const results: UserAction[] = [];

  for (const item of data) {

    const key: string = createKey(item)
    // seen.add(key)
    // if (seen.has(key)) results.push(item);

    if (!seen.has(key)) {
      seen.add(key);
      results.push(item);
    }
  }

  return results
}

// 按 userId 分组
// TODO 这里返回值类型是map  不是record
function groupByUserId(data: UserAction[]): Map<string, UserAction[]> {
  const result = new Map<string, UserAction[]>();
  for (const item of data) {
    //  get还是has?  用has  因为has是判断key是否存在,get是取值
    if (!result.has(item.userId)) result.set(item.userId, [])
    // result.set(item.userId, [item])   // 这个写法会覆盖之前的item  不对

    // !是TypeScript 非空断言  意思是我确定这里不是 undefined  
    result.get(item.userId)!.push(item);

  }

  return result;
}



function buildSummary(userId: string, data: UserAction[]): UserSummary {

  const platform = new Set<string>();


  // latestActions
  const latestActions: Record<string, number> = {};
  const latestActionTimes: Record<string, number> = {};
  let invalidLogs: number = 0;

  // 计算 averageDurations  
  const durationSums: Record<string, number> = {};
  const durationCounts: Record<string, number> = {};
  const averageDurations: Record<string, number> = {};

  for (const item of data) {
    if (!isValid(item)) {
      invalidLogs++
      // invalid 数据不能参与后面的 latest / average，所以要 continue
      continue;
    }

    // 如果只想统计有效数据来源，就放在校验后:
    platform.add(item.platform)

    //当前数据的时间
    const time = new Date(item.createdAt).getTime();
    // 取出当前  已记录的“最新时间”
    const currentLatestTime = latestActionTimes[item.action];

    if (currentLatestTime === undefined || time > currentLatestTime) {
      latestActionTimes[item.action] = time;
      latestActions[item.action] = item.duration as number;

    }

    // averageDurations
    if (typeof item.duration === "number") {
      // 这样不对,累加前要给初始值
      // 第一次时：durationSums[item.action]  是 undefined
      // durationSums[item.action] += item.duration
      // durationCounts[item.action]++

      durationSums[item.action] = (durationSums[item.action] ?? 0) + item.duration
      durationCounts[item.action] = (durationCounts[item.action] ?? 0) + 1;
    }
    // 你现在每一轮都算   能做，但不清晰。推荐最后统一算
    // averageDurations[item.action] = durationSums[item.action] / durationCounts[item.action]


  }

  // const 后面的这个变量名字是自定义的，无所谓是什么 合理就行
  for (const key in durationSums) {
    averageDurations[key] =
      durationSums[key] / durationCounts[key];

  }
  return {
    userId,
    platforms: Array.from(platform).sort(),
    latestActions,
    averageDurations,
    invalidLogs,
  }

}



function summarizeUserActions(data: UserAction[]): UserSummary[] {
  const duplicate = deduplicateAction(data);
  const grouped = groupByUserId(duplicate)

  const results: UserSummary[] = []

  // TODO 
  grouped.forEach((items, userId) => {
    results.push(buildSummary(userId, items))
  })

  return results
}
export default summarizeUserActions;