// “任务执行顺序”问题
// build system
// deployment system
// workflow engine
// 里最常见的问题之一。

// 给定任务依赖关系：
// A depends on B   B必须先于A执行
// B depends on C
// 输出一个合法执行顺序。如果有循环依赖：返回 error。


// 输入
// [
//   ["A", "B"],
//   ["B", "C"],
//   ["D", "A"]
// ]
// 输出 ["C", "B", "A", "D"]

// DAG：Directed Acyclic Graph   有方向 没有环  图结构
// DFS 是什么？ Depth First Search 深度优先搜索
// BFS 是什么？ Breadth First Search 广度优先搜索


type Dependency = [string, string];   // ["A", "B"] means A depends on B

// 输入多个依赖数组  返回带执行顺序的数组
function resolveOrder(dependencies: Dependency[]): string[] {
  // 任务 -> 它依赖的任务列表
  const graph = new Map<string, string[]>();

  // Step 1: build graph
  for (const [task, dependency] of dependencies) {
    if (!graph.has(task)) {
      graph.set(task, []);
    }

    // 依赖项本身也是一个节点  所以也要初始化 
    if (!graph.has(dependency)) {
      graph.set(dependency, []);
    }

    graph.get(task)!.push(dependency);
  }

  // 拓扑排序（Topological Sort） + DFS：   DFS 思路：“先递归处理所有依赖，最后再加入结果”
  // 存最终的执行顺序
  // “一个任务必须等它依赖的任务先完成”
  const result: string[] = [];

  // 当前递归路径上的节点 current DFS path 用于检测是否有环
  const visiting = new Set<string>();
  // 已经完全处理过的
  const visited = new Set<string>();  // already fully processed


  // 递归处理任务
  function dfs(task: string): void {
    // 已经处理过了   直接跳过
    if (visited.has(task)) {
      return;
    }
    // 如果当前递归路径里又遇到自己  说明有环 
    if (visiting.has(task)) {
      throw new Error("Cycle detected");
    }

    visiting.add(task);

    const dependenciesOfTask = graph.get(task) ?? [];

    for (const dependency of dependenciesOfTask) {
      dfs(dependency);
    }

    visiting.delete(task);
    visited.add(task);

    // 所有依赖处理完之后  才push
    result.push(task);
  }

  // 对所有任务都做 DFS
  for (const task of Array.from(graph.keys())) {
    dfs(task);
  }

  return result;
}
// 核心思想：先递归处理依赖，最后再把自己加入结果
// 所以天然得到：“依赖在前，任务在后”的顺序。
const input: Dependency[] = [
  ["A", "B"],
  ["B", "C"],
  ["D", "A"],
];

console.log(resolveOrder(input));