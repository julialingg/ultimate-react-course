

// 对于同一个 company + metric，只保留 timestamp 最新的一条 
function getNewestData(data: RawRecord[]): RawRecord[] {

  const latestTime: Record<string, number> = {};
  const latestItem: Record<string, RawRecord> = {};
  const results: RawRecord[] = []

  for (const item of data) {
    const time = new Date(item.timestamp).getTime();
    if (latestTime[item.company + item.metric] === undefined || time > latestTime[item.company + item.metric]) {
      latestTime[item.company + item.metric] = time
      latestItem[item.company + item.metric] = item;
    }
  }

  for (const key in latestItem) {
    results.push(latestItem[key])
  }
  return results


}


//TODO  如果数据量很大怎么办？
function normalizeCompanyData(records: RawRecord[]): NormalizedCompany[] {

  const newestData = getNewestData(uppercases)


  for (const item of newestData) {

    results.push(
      {
        company: item.company,

        metrics: {
          [item.metric]: {
            latestValue: item.value,
            source: item.source,
            timestamp: item.timestamp
          }
        }


      }


    )

  }

  return res;
}

// 你现在思路是对的，但有几个明显 bug：
// item.company + item.metric 容易 key 冲突，最好用 ${company}::${metric}
// 最后你没有把同一个公司的多个 metric 合并到同一个 object
// latestValue 类型不允许 null，但过滤后 TypeScript 仍然不知道，需要类型收窄


type RawRecord = {
  source: string;
  company: string;
  metric: string;
  value: number | string | null;
  timestamp: string;
};

type NormalizedCompany = {
  company: string;
  metrics: {
    [metric: string]: {
      latestValue: number | string;
      source: string;
      timestamp: string;
    };
  };
};


// 更好的写法是“一次遍历完成过滤、公司名标准化、取最新、聚合”：
function normalizeCompanyData1(records: RawRecord[]): NormalizedCompany[] {
  const companies: Record<string, NormalizedCompany> = {};

  for (const record of records) {
    if (record.value === null) continue;

    const company = record.company.toUpperCase();
    const metric = record.metric;

    if (!companies[company]) {
      companies[company] = {
        company,
        metrics: {},
      };
    }

    const current = companies[company].metrics[metric];

    if (
      !current ||
      new Date(record.timestamp).getTime() > new Date(current.timestamp).getTime()
    ) {
      companies[company].metrics[metric] = {
        latestValue: record.value,
        source: record.source,
        timestamp: record.timestamp,
      };
    }
  }

  return Object.values(companies).sort((a, b) => a.company.localeCompare(b.company)
  );
}

// 如果是按自定义顺序 要怎么实现排序  例如 按照 公司名顺序为 BMW > Amazon > Semens  
// 如果要自定义排序，比如 BMW > Amazon > Siemens：
const order = ["BMW", "AMAZON", "SIEMENS"];
const rank = new Map(order.map((name, index) => [name, index]));

return Object.values(companies).sort((a, b) => {
  const rankA = rank.get(a.company) ?? Number.MAX_SAFE_INTEGER;
  const rankB = rank.get(b.company) ?? Number.MAX_SAFE_INTEGER;

  if (rankA !== rankB) return rankA - rankB;

  return a.company.localeCompare(b.company);
});