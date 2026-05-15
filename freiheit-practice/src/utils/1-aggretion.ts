// Company Signals Aggregation

type RawSignal = {
  company: string;
  source: "linkedin" | "github" | "reddit";
  metric: string;
  value: number | string | null;
  timestamp: string;
};

const rawSignals: RawSignal[] = [
  {
    company: "OpenAI",
    source: "linkedin",
    metric: "employee_growth",
    value: 12,
    timestamp: "2025-08-01T10:00:00Z",
  },
  {
    company: "OpenAI",
    source: "reddit",
    metric: "sentiment_score",
    value: 8,
    timestamp: "2025-08-02T12:00:00Z",
  },
  {
    company: "OpenAI",
    source: "github",
    metric: "stars",
    value: 54000,
    timestamp: "2025-08-03T09:30:00Z",
  },

  // duplicate entry
  {
    company: "OpenAI",
    source: "github",
    metric: "stars",
    value: 54000,
    timestamp: "2025-08-03T09:30:00Z",
  },

  {
    company: "Stripe",
    source: "linkedin",
    metric: "employee_growth",
    value: 7,
    timestamp: "2025-08-01T11:00:00Z",
  },
  {
    company: "Stripe",
    source: "reddit",
    metric: "sentiment_score",
    value: 6,
    timestamp: "2025-08-01T15:00:00Z",
  },
  {
    company: "Stripe",
    source: "github",
    metric: "stars",
    value: 12000,
    timestamp: "2025-08-04T08:20:00Z",
  },

  // invalid value
  {
    company: "Stripe",
    source: "reddit",
    metric: "sentiment_score",
    value: null,
    timestamp: "2025-08-05T08:20:00Z",
  },

  {
    company: "Spotify",
    source: "linkedin",
    metric: "employee_growth",
    value: 5,
    timestamp: "2025-08-02T10:00:00Z",
  },
  {
    company: "Spotify",
    source: "reddit",
    metric: "sentiment_score",
    value: 9,
    timestamp: "2025-08-03T14:00:00Z",
  },
  {
    company: "Spotify",
    source: "github",
    metric: "stars",
    value: 22000,
    timestamp: "2025-08-04T10:10:00Z",
  },

  // latest metric overwrite test
  {
    company: "Spotify",
    source: "github",
    metric: "stars",
    value: 23000,
    timestamp: "2025-08-05T10:10:00Z",
  },

  // invalid timestamp
  {
    company: "Spotify",
    source: "reddit",
    metric: "sentiment_score",
    value: 7,
    timestamp: "invalid-date",
  },

  {
    company: "N26",
    source: "linkedin",
    metric: "employee_growth",
    value: 3,
    timestamp: "2025-08-02T09:00:00Z",
  },
  {
    company: "N26",
    source: "reddit",
    metric: "sentiment_score",
    value: "mixed",
    timestamp: "2025-08-03T09:00:00Z",
  },
  {
    company: "N26",
    source: "github",
    metric: "stars",
    value: 4000,
    timestamp: "2025-08-04T09:00:00Z",
  },
];


function isValidSignal(signal: RawSignal): boolean {
  //  new Date(...) 创建日期对象的语法。
  // 例如   new Date("2025-08-01T10:00:00Z")
  // 会得到一个 Date 对象： Fri Aug 01 2025 ..  你可以理解成：  “把string类型的日期解析成真正的时间对象”

  // .getTime() 返回时间戳（timestamp） 从 1970-01-01 00:00:00 UTC 到当前时间 经过了多少毫秒
  // 为什么要转成数字时间戳？ 因为数字最好比较   很容易判断哪个时间更新

  // 因为timestamp是string类型 所以要先转成number才能比较
  const time = new Date(signal.timestamp).getTime();

  if (signal.value === null || Number.isNaN(time)) {
    // Number.isNaN(value)      Number.isNaN() 这是 Number 对象上的一个方法
    // 返回：
    // true  -> value 是 NaN
    // false -> value 不是 NaN

    return false;
  }

  return true;
}


// 去重方式: “唯一 key”
function createSignalKey(signal: RawSignal): string {
  return `${signal.company}-${signal.source}-${signal.metric}-${signal.timestamp}`;
}


function deduplicateSignals(data: RawSignal[]): RawSignal[] {

  // Set 是 JS 的一种数据结构。作用：存“不重复的数据”你可以理解成：自动去重的集合
  // new Set<string>  这个 Set 里面只能放 string
  // seen 是记录已经出现过的 key
  const seen = new Set<string>();

  const result: RawSignal[] = [];

  for (const signal of data) {
    const key = createSignalKey(signal);

    // 如果 Set 里还没有这个 key 才保留数据。
    if (!seen.has(key)) {
      seen.add(key);
      result.push(signal);
    }
  }

  return result;
}



function groupByCompany(data: RawSignal[]): Map<string, RawSignal[]> {
  // Map 键值对（key-value）数据结构
  //  company是key  因为是按照company分组的
  const groups = new Map<string, RawSignal[]>();

  // for...of 循环  遍历数组
  for (const signal of data) {
    // 如果这个公司第一次出现  就创建： 公司 -> 空数组
    // 为什么要先创建空数组 ?
    // 因为后面要：push(signal)往数组里放数据。如果数组不存在 push 会报错
    if (!groups.has(signal.company)) {
      groups.set(signal.company, []);
    }

    // groups.get(signal.company)作用:取出这个公司的数组 (这时候得到的可能是空数组 也可能是已经有了值的)
    // !是TypeScript 非空断言  意思是我确定这里不是 undefined  
    groups.get(signal.company)!.push(signal); // 这一句是每次循环里 一定会执行的 因为它没在if里啊

    //    如果公司不存在：
    //   先创建数组
    // 然后：   把 signal 放进去
    // 这是分组（group by)的最经典写法。

    // 等价代码:
    // for (const signal of data) {
    //   const company = signal.company;
    //   // 第一次出现
    //   if (!groups.has(company)) {
    //     groups.set(company, []);
    //   }

    //   // 拿到数组
    //   const companySignals = groups.get(company)!;

    //   // 放入数据
    //   companySignals.push(signal);
    // }

  }

  return groups;
}

// 最终输出每个公司一条 summary
type CompanySummary = {
  company: string;
  sources: string[];
  latestMetrics: Record<string, number | string>;
  numericAverages: Record<string, number>;
  invalidCount: number;
};


function buildCompanySummary(
  company: string,
  signals: RawSignal[]
): CompanySummary {
  const sources = new Set<string>();

  // 你不仅要保存“最新值”   还要保存“这个值对应的时间”
  const latestMetrics: Record<string, number | string> = {}; // 结构是 metric -> 对应的value
  const latestMetricTimes: Record<string, number> = {};  // 结构是 metric -> 最新时间戳

  // 计算平均值  需要sum和个数
  const numericSums: Record<string, number> = {};  // key是metric
  const numericCounts: Record<string, number> = {};

  let invalidCount = 0;

  for (const signal of signals) {
    // 因为用的Set  所以不会重复添加
    sources.add(signal.source);

    if (!isValidSignal(signal)) {
      invalidCount++;
      continue;
    }

    const time = new Date(signal.timestamp).getTime();

    // latestMetrics
    // 对每个 metric， 只保留最新 timestamp 对应的 value

    // 取出当前 metric 已记录的“最新时间”
    const currentLatestTime = latestMetricTimes[signal.metric];

    // 某个 metric 可能第一次出现 currentLatestTime就会是undefined  因为上面那句没取出值来
    // time > currentLatestTime 表示当前 signal 时间更晚
    if (currentLatestTime === undefined || time > currentLatestTime) {
      latestMetricTimes[signal.metric] = time;
      latestMetrics[signal.metric] = signal.value as number | string;
    }

    // numericAverages
    if (typeof signal.value === "number") {
      numericSums[signal.metric] =
        (numericSums[signal.metric] ?? 0) + signal.value;

      numericCounts[signal.metric] =
        (numericCounts[signal.metric] ?? 0) + 1;
    }
  }

  const numericAverages: Record<string, number> = {};

  for (const metric in numericSums) {
    numericAverages[metric] = numericSums[metric] / numericCounts[metric];
  }

  return {
    company,
    // 因为Set 不是数组而 sort() 是数组方法   所以：必须先把 Set 转成数组
    // Array.from(xxx)   作用 把“可迭代对象”转换成数组
    // .sort()  默认按字母顺序排序
    sources: Array.from(sources).sort(),
    latestMetrics,
    numericAverages,
    invalidCount,
  };
}

function summarizeSignals(data: RawSignal[]): CompanySummary[] {
  const deduplicated = deduplicateSignals(data);
  const grouped = groupByCompany(deduplicated);



  const result: CompanySummary[] = [];

  //   Map 的 forEach 语法
  // map.forEach((value, key) => {
  // })
  // 注意顺序：  value 在前   key 在后
  grouped.forEach((signals, company) => {
    result.push(buildCompanySummary(company, signals));
  });

  return result;

}

export default summarizeSignals;