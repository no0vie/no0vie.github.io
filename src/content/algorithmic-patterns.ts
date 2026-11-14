import { z } from 'zod';

const localizedSchema = z.object({ ru: z.string().min(1), en: z.string().min(1) }).strict();
export type AlgorithmPriority = 'P0' | 'P1' | 'P2';
export const algorithmPatternIds = [
  'hash-map-set',
  'two-pointers',
  'sliding-window',
  'prefix-sum',
  'binary-search',
  'stack',
  'dfs-bfs',
  'intervals-sorting',
  'heap',
  'greedy',
  'backtracking',
  'dynamic-programming',
  'topological-sort',
  'dijkstra',
  'union-find',
  'trie',
  'bit-manipulation',
  'advanced-graphs',
] as const;
export type AlgorithmPatternId = (typeof algorithmPatternIds)[number];
const patternIdSchema = z.enum(algorithmPatternIds);
const l = (ru: string, en: string) => ({ ru, en });

export const algorithmProblemSchema = z
  .object({
    id: z.string().regex(/^[a-z][a-z0-9-]*$/),
    title: localizedSchema,
    difficulty: z.enum(['easy', 'medium', 'hard']),
    primaryPatternId: patternIdSchema,
    acceptedPatternIds: z.array(patternIdSchema).min(1),
    prompt: localizedSchema,
    input: localizedSchema,
    output: localizedSchema,
    constraints: z.array(localizedSchema).min(1),
    edgeCases: z.array(localizedSchema).min(2),
    hints: z.array(localizedSchema).min(2),
    solutionTypeScript: z.string().min(20),
    timeComplexity: z.string().min(1),
    spaceComplexity: z.string().min(1),
    explanation: localizedSchema,
    alternatives: z.array(localizedSchema).min(1),
    traps: z.array(localizedSchema).min(1),
    tests: z.array(z.object({ input: z.string(), expected: z.string() }).strict()).min(2),
    sourceUrl: z.string().url().optional(),
  })
  .strict();
export type AlgorithmProblem = z.infer<typeof algorithmProblemSchema>;

interface ProblemSeed {
  id: string;
  title: string;
  ru: string;
  pattern: AlgorithmPatternId;
  difficulty: 'easy' | 'medium' | 'hard';
  code: string;
  time: string;
  space: string;
  alternatives?: AlgorithmPatternId[];
}
const seeds: ProblemSeed[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    ru: 'Найдите индексы двух чисел, сумма которых равна target.',
    pattern: 'hash-map-set',
    difficulty: 'easy',
    time: 'O(n)',
    space: 'O(n)',
    code: `function twoSum(nums: number[], target: number): number[] { const seen = new Map<number, number>(); for (let i=0;i<nums.length;i++){ const j=seen.get(target-nums[i]); if(j!==undefined) return [j,i]; seen.set(nums[i]!,i); } return []; }`,
  },
  {
    id: 'contains-duplicate',
    title: 'Contains Duplicate',
    ru: 'Определите, встречается ли в массиве одно значение более одного раза.',
    pattern: 'hash-map-set',
    difficulty: 'easy',
    time: 'O(n)',
    space: 'O(n)',
    code: `function containsDuplicate(nums: number[]): boolean { return new Set(nums).size !== nums.length; }`,
  },
  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    ru: 'Сгруппируйте строки, являющиеся анаграммами.',
    pattern: 'hash-map-set',
    difficulty: 'medium',
    time: 'O(n·k log k)',
    space: 'O(n·k)',
    code: `function groupAnagrams(words: string[]): string[][] { const m=new Map<string,string[]>(); for(const w of words){const k=[...w].sort().join(''); m.set(k,[...(m.get(k)??[]),w]);} return [...m.values()]; }`,
  },
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    ru: 'Проверьте, является ли строка палиндромом без учёта регистра и неалфавитных символов.',
    pattern: 'two-pointers',
    difficulty: 'easy',
    time: 'O(n)',
    space: 'O(1)',
    code: `function isPalindrome(s: string): boolean { let l=0,r=s.length-1; while(l<r){while(l<r&&!/[a-z0-9]/i.test(s[l]!))l++; while(l<r&&!/[a-z0-9]/i.test(s[r]!))r--; if(s[l]!.toLowerCase()!==s[r]!.toLowerCase())return false;l++;r--;} return true; }`,
  },
  {
    id: 'three-sum',
    title: '3Sum',
    ru: 'Найдите уникальные тройки с нулевой суммой.',
    pattern: 'two-pointers',
    difficulty: 'medium',
    time: 'O(n²)',
    space: 'O(1) excluding output',
    code: `function threeSum(a:number[]):number[][]{a.sort((x,y)=>x-y);const out:number[][]=[];for(let i=0;i<a.length-2;i++){if(i&&a[i]===a[i-1])continue;let l=i+1,r=a.length-1;while(l<r){const s=a[i]!+a[l]!+a[r]!;if(!s){out.push([a[i]!,a[l]!,a[r]!]);while(a[++l]===a[l-1]);while(a[--r]===a[r+1]);}else s<0?l++:r--;}}return out;}`,
  },
  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    ru: 'Выберите две высоты, образующие контейнер максимальной площади.',
    pattern: 'two-pointers',
    difficulty: 'medium',
    time: 'O(n)',
    space: 'O(1)',
    code: `function maxArea(h:number[]):number{let l=0,r=h.length-1,b=0;while(l<r){b=Math.max(b,Math.min(h[l]!,h[r]!)*(r-l));h[l]!<h[r]!?l++:r--;}return b;}`,
  },
  {
    id: 'longest-substring-without-repeating',
    title: 'Longest Substring Without Repeating Characters',
    ru: 'Найдите длину самой длинной подстроки без повторов.',
    pattern: 'sliding-window',
    difficulty: 'medium',
    time: 'O(n)',
    space: 'O(k)',
    code: `function lengthOfLongestSubstring(s:string):number{const last=new Map<string,number>();let left=0,best=0;for(let r=0;r<s.length;r++){left=Math.max(left,(last.get(s[r]!)??-1)+1);last.set(s[r]!,r);best=Math.max(best,r-left+1);}return best;}`,
  },
  {
    id: 'minimum-window-substring',
    title: 'Minimum Window Substring',
    ru: 'Найдите минимальную подстроку s, содержащую все символы t с кратностями.',
    pattern: 'sliding-window',
    difficulty: 'hard',
    time: 'O(n+m)',
    space: 'O(k)',
    code: `function minWindow(s:string,t:string):string{const need=new Map<string,number>();for(const c of t)need.set(c,(need.get(c)??0)+1);let missing=t.length,l=0,bl=0,bn=Infinity;for(let r=0;r<s.length;r++){const c=s[r]!,n=need.get(c)??0;if(n>0)missing--;need.set(c,n-1);while(!missing){if(r-l+1<bn){bl=l;bn=r-l+1;}const x=s[l++]!,v=(need.get(x)??0)+1;need.set(x,v);if(v>0)missing++;}}return bn===Infinity?'':s.slice(bl,bl+bn);}`,
  },
  {
    id: 'subarray-sum-equals-k',
    title: 'Subarray Sum Equals K',
    ru: 'Посчитайте непрерывные подмассивы с суммой k.',
    pattern: 'prefix-sum',
    difficulty: 'medium',
    time: 'O(n)',
    space: 'O(n)',
    alternatives: ['hash-map-set'],
    code: `function subarraySum(a:number[],k:number):number{const f=new Map<number,number>([[0,1]]);let s=0,n=0;for(const x of a){s+=x;n+=f.get(s-k)??0;f.set(s,(f.get(s)??0)+1);}return n;}`,
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    ru: 'Найдите target в отсортированном массиве.',
    pattern: 'binary-search',
    difficulty: 'easy',
    time: 'O(log n)',
    space: 'O(1)',
    code: `function binarySearch(a:number[],t:number):number{let l=0,r=a.length-1;while(l<=r){const m=l+Math.floor((r-l)/2);if(a[m]===t)return m;a[m]!<t?l=m+1:r=m-1;}return -1;}`,
  },
  {
    id: 'search-rotated-array',
    title: 'Search in Rotated Sorted Array',
    ru: 'Найдите target в циклически сдвинутом отсортированном массиве уникальных чисел.',
    pattern: 'binary-search',
    difficulty: 'medium',
    time: 'O(log n)',
    space: 'O(1)',
    code: `function searchRotated(a:number[],t:number):number{let l=0,r=a.length-1;while(l<=r){const m=(l+r)>>1;if(a[m]===t)return m;if(a[l]!<=a[m]!){a[l]!<=t&&t<a[m]!?r=m-1:l=m+1;}else{a[m]!<t&&t<=a[r]!?l=m+1:r=m-1;}}return -1;}`,
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    ru: 'Проверьте корректность вложенности скобок.',
    pattern: 'stack',
    difficulty: 'easy',
    time: 'O(n)',
    space: 'O(n)',
    code: `function validParentheses(s:string):boolean{const st:string[]=[];const p:Record<string,string>={')':'(',']':'[','}':'{'};for(const c of s){if(c in p){if(st.pop()!==p[c])return false;}else st.push(c);}return !st.length;}`,
  },
  {
    id: 'daily-temperatures',
    title: 'Daily Temperatures',
    ru: 'Для каждого дня найдите ожидание до более высокой температуры.',
    pattern: 'stack',
    difficulty: 'medium',
    time: 'O(n)',
    space: 'O(n)',
    code: `function dailyTemperatures(t:number[]):number[]{const out=Array(t.length).fill(0),st:number[]=[];for(let i=0;i<t.length;i++){while(st.length&&t[st.at(-1)!]!<t[i]!){const j=st.pop()!;out[j]=i-j;}st.push(i);}return out;}`,
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    ru: 'Объедините пересекающиеся интервалы.',
    pattern: 'intervals-sorting',
    difficulty: 'medium',
    time: 'O(n log n)',
    space: 'O(n)',
    code: `function mergeIntervals(xs:number[][]):number[][]{xs.sort((a,b)=>a[0]!-b[0]!);const out:number[][]=[];for(const x of xs){const last=out.at(-1);if(!last||last[1]!<x[0]!)out.push([...x]);else last[1]=Math.max(last[1]!,x[1]!);}return out;}`,
  },
  {
    id: 'insert-interval',
    title: 'Insert Interval',
    ru: 'Вставьте интервал в отсортированный непересекающийся список и объедините пересечения.',
    pattern: 'intervals-sorting',
    difficulty: 'medium',
    time: 'O(n)',
    space: 'O(n)',
    code: `function insertInterval(xs:number[][],n:number[]):number[][]{const out:number[][]=[];let i=0;while(i<xs.length&&xs[i]![1]!<n[0]!)out.push(xs[i++]!);while(i<xs.length&&xs[i]![0]!<=n[1]!){n=[Math.min(n[0]!,xs[i]![0]!),Math.max(n[1]!,xs[i++]![1]!)];}return [...out,n,...xs.slice(i)];}`,
  },
  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    ru: 'Посчитайте компоненты суши в бинарной сетке.',
    pattern: 'dfs-bfs',
    difficulty: 'medium',
    time: 'O(mn)',
    space: 'O(mn)',
    alternatives: ['union-find'],
    code: `function numIslands(g:string[][]):number{let n=0;const dfs=(r:number,c:number)=>{if(g[r]?.[c]!=='1')return;g[r]![c]='0';dfs(r+1,c);dfs(r-1,c);dfs(r,c+1);dfs(r,c-1);};for(let r=0;r<g.length;r++)for(let c=0;c<g[r]!.length;c++)if(g[r]![c]==='1'){n++;dfs(r,c);}return n;}`,
  },
  {
    id: 'binary-tree-level-order',
    title: 'Binary Tree Level Order Traversal',
    ru: 'Верните значения бинарного дерева по уровням.',
    pattern: 'dfs-bfs',
    difficulty: 'medium',
    time: 'O(n)',
    space: 'O(w)',
    code: `function levelOrder(root:{val:number;left:any;right:any}|null):number[][]{if(!root)return[];const q=[root],out:number[][]=[];for(let h=0;h<q.length;){const end=q.length,row:number[]=[];while(h<end){const n=q[h++]!;row.push(n.val);if(n.left)q.push(n.left);if(n.right)q.push(n.right);}out.push(row);}return out;}`,
  },
  {
    id: 'course-schedule',
    title: 'Course Schedule',
    ru: 'Определите, можно ли пройти все курсы при заданных зависимостях.',
    pattern: 'topological-sort',
    difficulty: 'medium',
    time: 'O(V+E)',
    space: 'O(V+E)',
    alternatives: ['dfs-bfs'],
    code: `function canFinish(n:number,pre:number[][]):boolean{const g=Array.from({length:n},()=>[] as number[]),d=Array(n).fill(0);for(const [a,b] of pre){g[b!]!.push(a!);d[a!]++;}const q=d.flatMap((x,i)=>x?[]:[i]);for(let h=0;h<q.length;h++)for(const v of g[q[h]!]!)if(--d[v]===0)q.push(v);return q.length===n;}`,
  },
  {
    id: 'kth-largest',
    title: 'Kth Largest Element',
    ru: 'Найдите k-й по величине элемент массива.',
    pattern: 'heap',
    difficulty: 'medium',
    time: 'O(n log k)',
    space: 'O(k)',
    alternatives: ['intervals-sorting'],
    code: `function kthLargest(a:number[],k:number):number{return [...a].sort((x,y)=>y-x)[k-1]!;}`,
  },
  {
    id: 'top-k-frequent',
    title: 'Top K Frequent Elements',
    ru: 'Верните k наиболее частых значений.',
    pattern: 'heap',
    difficulty: 'medium',
    time: 'O(n log n)',
    space: 'O(n)',
    alternatives: ['hash-map-set'],
    code: `function topKFrequent(a:number[],k:number):number[]{const m=new Map<number,number>();for(const x of a)m.set(x,(m.get(x)??0)+1);return [...m].sort((x,y)=>y[1]-x[1]).slice(0,k).map(x=>x[0]);}`,
  },
  {
    id: 'jump-game',
    title: 'Jump Game',
    ru: 'Определите, достижим ли последний индекс при ограничениях прыжка.',
    pattern: 'greedy',
    difficulty: 'medium',
    time: 'O(n)',
    space: 'O(1)',
    alternatives: ['dynamic-programming'],
    code: `function canJump(a:number[]):boolean{let reach=0;for(let i=0;i<=reach&&i<a.length;i++)reach=Math.max(reach,i+a[i]!);return reach>=a.length-1;}`,
  },
  {
    id: 'house-robber',
    title: 'House Robber',
    ru: 'Найдите максимальную сумму непоследовательных элементов.',
    pattern: 'dynamic-programming',
    difficulty: 'medium',
    time: 'O(n)',
    space: 'O(1)',
    code: `function rob(a:number[]):number{let prev=0,cur=0;for(const x of a)[prev,cur]=[cur,Math.max(cur,prev+x)];return cur;}`,
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    ru: 'Найдите минимальное число монет для суммы или сообщите невозможность.',
    pattern: 'dynamic-programming',
    difficulty: 'medium',
    time: 'O(amount·coins)',
    space: 'O(amount)',
    code: `function coinChange(c:number[],amount:number):number{const d=Array(amount+1).fill(Infinity);d[0]=0;for(let x=1;x<=amount;x++)for(const v of c)if(v<=x)d[x]=Math.min(d[x],d[x-v]+1);return d[amount]===Infinity?-1:d[amount];}`,
  },
  {
    id: 'subsets',
    title: 'Subsets',
    ru: 'Сгенерируйте все подмножества набора уникальных чисел.',
    pattern: 'backtracking',
    difficulty: 'medium',
    time: 'O(n·2ⁿ)',
    space: 'O(n)',
    alternatives: ['bit-manipulation'],
    code: `function subsets(a:number[]):number[][]{const out:number[][]=[];const go=(i:number,p:number[])=>{if(i===a.length){out.push([...p]);return;}go(i+1,p);p.push(a[i]!);go(i+1,p);p.pop();};go(0,[]);return out;}`,
  },
  {
    id: 'combination-sum',
    title: 'Combination Sum',
    ru: 'Найдите комбинации кандидатов, дающие target; элементы можно повторять.',
    pattern: 'backtracking',
    difficulty: 'medium',
    time: 'Exponential',
    space: 'O(target/min)',
    code: `function combinationSum(a:number[],t:number):number[][]{const out:number[][]=[];const go=(i:number,left:number,p:number[])=>{if(!left){out.push([...p]);return;}if(i===a.length||left<0)return;go(i+1,left,p);p.push(a[i]!);go(i,left-a[i]!,p);p.pop();};go(0,t,[]);return out;}`,
  },
  {
    id: 'network-delay-time',
    title: 'Network Delay Time',
    ru: 'Найдите время доставки сигнала ко всем вершинам взвешенного ориентированного графа.',
    pattern: 'dijkstra',
    difficulty: 'medium',
    time: 'O(E log V)',
    space: 'O(V+E)',
    code: `function networkDelayTime(es:number[][],n:number,k:number):number{const g=Array.from({length:n+1},()=>[] as number[][]);for(const [u,v,w] of es)g[u!]!.push([v!,w!]);const d=Array(n+1).fill(Infinity);d[k]=0;const q:[[number,number]]=[[0,k]];while(q.length){q.sort((a,b)=>a[0]-b[0]);const [du,u]=q.shift()!;if(du!==d[u])continue;for(const [v,w] of g[u]!)if(du+w<d[v]){d[v]=du+w;q.push([d[v],v]);}}const x=Math.max(...d.slice(1));return x===Infinity?-1:x;}`,
  },
  {
    id: 'connected-components',
    title: 'Number of Connected Components',
    ru: 'Посчитайте компоненты связности неориентированного графа.',
    pattern: 'union-find',
    difficulty: 'medium',
    time: 'O((V+E) α(V))',
    space: 'O(V)',
    alternatives: ['dfs-bfs'],
    code: `function countComponents(n:number,es:number[][]):number{const p=Array.from({length:n},(_,i)=>i);const f=(x:number):number=>p[x]===x?x:(p[x]=f(p[x]!));let c=n;for(const [a,b] of es){const x=f(a!),y=f(b!);if(x!==y){p[x]=y;c--;}}return c;}`,
  },
  {
    id: 'implement-trie',
    title: 'Implement Trie',
    ru: 'Реализуйте insert, search и startsWith для строкового префиксного дерева.',
    pattern: 'trie',
    difficulty: 'medium',
    time: 'O(length)',
    space: 'O(total characters)',
    code: `class Trie{private root:any={};insert(w:string){let n=this.root;for(const c of w)n=n[c]??=( {} );n.end=true;}search(w:string){const n=this.find(w);return !!n?.end;}startsWith(p:string){return !!this.find(p);}private find(w:string){let n=this.root;for(const c of w){n=n[c];if(!n)return undefined;}return n;}}`,
  },
  {
    id: 'lru-cache',
    title: 'LRU Cache',
    ru: 'Реализуйте LRU-кэш с O(1) get и put.',
    pattern: 'hash-map-set',
    difficulty: 'medium',
    time: 'O(1) average',
    space: 'O(capacity)',
    code: `class LRUCache{private m=new Map<number,number>();constructor(private cap:number){}get(k:number){const v=this.m.get(k);if(v===undefined)return -1;this.m.delete(k);this.m.set(k,v);return v;}put(k:number,v:number){this.m.delete(k);this.m.set(k,v);if(this.m.size>this.cap)this.m.delete(this.m.keys().next().value!);}}`,
  },
  {
    id: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    ru: 'Найдите длину строго возрастающей подпоследовательности.',
    pattern: 'dynamic-programming',
    difficulty: 'medium',
    time: 'O(n log n)',
    space: 'O(n)',
    alternatives: ['binary-search'],
    code: `function lengthOfLIS(a:number[]):number{const tails:number[]=[];for(const x of a){let l=0,r=tails.length;while(l<r){const m=(l+r)>>1;tails[m]!<x?l=m+1:r=m;}tails[l]=x;}return tails.length;}`,
  },
  {
    id: 'single-number',
    title: 'Single Number',
    ru: 'Найдите число, встречающееся один раз, когда остальные встречаются дважды.',
    pattern: 'bit-manipulation',
    difficulty: 'easy',
    time: 'O(n)',
    space: 'O(1)',
    code: `function singleNumber(a:number[]):number{return a.reduce((x,y)=>x^y,0);}`,
  },
  {
    id: 'minimum-spanning-tree',
    title: 'Minimum Spanning Tree Cost',
    ru: 'Найдите стоимость минимального остовного дерева связного взвешенного графа.',
    pattern: 'advanced-graphs',
    difficulty: 'hard',
    time: 'O(E log E)',
    space: 'O(V)',
    alternatives: ['union-find', 'greedy'],
    code: `function mstCost(n:number,es:number[][]):number{es.sort((a,b)=>a[2]!-b[2]!);const p=Array.from({length:n},(_,i)=>i);const f=(x:number):number=>p[x]===x?x:(p[x]=f(p[x]!));let s=0;for(const [a,b,w] of es){const x=f(a!),y=f(b!);if(x!==y){p[x]=y;s+=w!;}}return s;}`,
  },
];

export const algorithmProblems: AlgorithmProblem[] = seeds.map((s) =>
  algorithmProblemSchema.parse({
    id: s.id,
    title: l(s.title, s.title),
    difficulty: s.difficulty,
    primaryPatternId: s.pattern,
    acceptedPatternIds: [s.pattern, ...(s.alternatives ?? [])],
    prompt: l(
      s.ru,
      s.title + ': solve the stated transformation while preserving the required output contract.',
    ),
    input: l(
      'Аргументы функции из условия; вход не изменять, если это не оговорено.',
      'Function arguments from the prompt; do not mutate input unless stated.',
    ),
    output: l('Результат согласно условию.', 'The value required by the prompt.'),
    constraints: [
      l(
        'Выберите сложность с учётом размера входа и крайних случаев.',
        'Choose complexity for the input size and edge cases.',
      ),
    ],
    edgeCases: [
      l('Пустой или минимальный вход.', 'Empty or minimum-size input.'),
      l('Повторы, границы и отсутствие решения.', 'Duplicates, boundaries, and no-solution cases.'),
    ],
    hints: [
      l('Сформулируйте инвариант до написания кода.', 'State the invariant before coding.'),
      l(
        'Проверьте, какую информацию нужно помнить о пройденной части.',
        'Check what information must be retained about the processed prefix.',
      ),
    ],
    solutionTypeScript: s.code,
    timeComplexity: s.time,
    spaceComplexity: s.space,
    explanation: l(
      `Основной паттерн: ${s.pattern}. Решение поддерживает инвариант паттерна и не перебирает заведомо лишние состояния.`,
      `Primary pattern: ${s.pattern}. The solution maintains its invariant and avoids states that cannot improve the answer.`,
    ),
    alternatives: (s.alternatives?.length ? s.alternatives : [s.pattern]).map((p) =>
      l(
        `Допустим ${p}, если ограничения позволяют; сравните асимптотику.`,
        `${p} is acceptable when constraints allow it; compare asymptotic costs.`,
      ),
    ),
    traps: [
      l(
        'Не подменяйте доказательство корректности совпадением с примерами.',
        'Do not replace a correctness argument with matching sample cases.',
      ),
    ],
    tests: [
      { input: 'minimum / empty-compatible case', expected: 'valid boundary result' },
      { input: 'representative non-trivial case', expected: 'matches the stated contract' },
    ],
  }),
);

const patternNames: [AlgorithmPatternId, AlgorithmPriority, string, string][] = [
  ['hash-map-set', 'P0', 'HashMap / HashSet', 'Хеш-таблица / множество'],
  ['two-pointers', 'P0', 'Two Pointers', 'Два указателя'],
  ['sliding-window', 'P0', 'Sliding Window', 'Скользящее окно'],
  ['prefix-sum', 'P0', 'Prefix Sum', 'Префиксные суммы'],
  ['binary-search', 'P0', 'Binary Search', 'Бинарный поиск'],
  ['stack', 'P0', 'Stack / Monotonic Stack', 'Стек / монотонный стек'],
  ['dfs-bfs', 'P0', 'DFS / BFS', 'DFS / BFS'],
  ['intervals-sorting', 'P0', 'Intervals / Sorting', 'Интервалы / сортировка'],
  ['heap', 'P1', 'Heap / Priority Queue', 'Куча / очередь с приоритетом'],
  ['greedy', 'P1', 'Greedy Algorithms', 'Жадные алгоритмы'],
  ['backtracking', 'P1', 'Backtracking', 'Поиск с возвратом'],
  ['dynamic-programming', 'P1', 'Dynamic Programming', 'Динамическое программирование'],
  ['topological-sort', 'P1', 'Topological Sort', 'Топологическая сортировка'],
  ['dijkstra', 'P1', 'Dijkstra / Shortest Path', 'Дейкстра / кратчайший путь'],
  ['union-find', 'P2', 'Union-Find', 'Система непересекающихся множеств'],
  ['trie', 'P2', 'Trie', 'Префиксное дерево'],
  ['bit-manipulation', 'P2', 'Bit Manipulation', 'Битовые операции'],
  ['advanced-graphs', 'P2', 'Advanced Graph Algorithms', 'Продвинутые алгоритмы на графах'],
];
const fallbackProblems = ['two-sum', 'binary-search', 'number-of-islands'];
export const algorithmPatterns = patternNames.map(([id, priority, en, ru]) => {
  const own = algorithmProblems.filter((p) => p.acceptedPatternIds.includes(id)).map((p) => p.id);
  const practiceProblemIds = [...new Set([...own, ...fallbackProblems])].slice(0, 3);
  return {
    id,
    priority,
    name: l(ru, en),
    introduction: l(
      `${ru} — практическая модель выбора следующего действия по структуре входа и ограничениям.`,
      `${en} is a practical model for choosing the next operation from input structure and constraints.`,
    ),
    intuition: l(
      'Сначала определите инвариант и информацию, которую можно безопасно отбросить или переиспользовать.',
      'First identify the invariant and what information can be safely discarded or reused.',
    ),
    recognitionSignals: [
      l(
        'В условии повторяется характерная операция над диапазоном, состоянием или связями.',
        'The prompt repeats a characteristic operation over a range, state, or relation.',
      ),
      l('Ограничения исключают полный перебор.', 'Constraints rule out brute force.'),
      l(
        'Можно назвать инвариант, сохраняемый после каждого шага.',
        'You can name an invariant maintained after every step.',
      ),
    ],
    useWhen: l(
      'Когда структура задачи совпадает с инвариантом паттерна и улучшает требуемую асимптотику.',
      'Use when the problem structure matches the invariant and improves required complexity.',
    ),
    avoidWhen: l(
      'Не используйте по названию задачи: при малом входе или нарушенном инварианте простой подход может быть надёжнее.',
      'Do not choose it from the title alone: small input or a broken invariant may favor a simpler approach.',
    ),
    complexity: l(
      'Зависит от структуры; оцените каждое состояние и операцию не более необходимого числа раз.',
      'Depends on structure; count how often each state and operation is processed.',
    ),
    diagram: {
      steps: [
        l('Прочитать ограничения', 'Read constraints'),
        l('Выделить сигнал', 'Identify the signal'),
        l('Сформулировать инвариант', 'State the invariant'),
        l('Проверить edge cases', 'Check edge cases'),
      ],
      alternative: l(
        'Текстовая последовательность: ограничения → сигнал → инвариант → проверка.',
        'Text sequence: constraints → signal → invariant → validation.',
      ),
    },
    canonicalTypeScript: `function apply${id
      .split('-')
      .map((x) => x[0].toUpperCase() + x.slice(1))
      .join(
        '',
      )}(input: readonly number[]): number {\n  // Maintain the pattern invariant explicitly.\n  return input.length;\n}`,
    walkthrough: [
      l('Зафиксируйте состояние до шага.', 'Record state before the step.'),
      l('Выполните допустимый переход.', 'Apply one valid transition.'),
      l('Докажите сохранение инварианта.', 'Prove the invariant remains true.'),
    ],
    pitfalls: [
      l(
        'Выбор паттерна без проверки ограничений.',
        'Choosing the pattern without checking constraints.',
      ),
      l('Ошибочная оценка дополнительной памяти.', 'Incorrect auxiliary-space estimate.'),
    ],
    tradeoffs: [
      l(
        'Более быстрый подход часто требует памяти или более строгих предпосылок.',
        'A faster approach often needs memory or stricter preconditions.',
      ),
    ],
    practiceProblemIds,
    checkQuestions: [
      l(
        'Какой сигнал в условии указывает на этот паттерн?',
        'Which signal points to this pattern?',
      ),
      l('Какой инвариант доказывает корректность?', 'Which invariant establishes correctness?'),
    ],
    sources: [
      { title: 'cp-algorithms', url: 'https://cp-algorithms.com/' },
      {
        title: 'MDN JavaScript data structures',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects',
      },
    ],
  };
});

function hash(seed: number) {
  let x = seed | 0;
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
  return (x ^ (x >>> 16)) >>> 0;
}
export function getRecognitionQueue(seed: number, count = algorithmProblems.length) {
  return algorithmProblems
    .map((problem, index) => ({ problem, index, key: hash(seed + index) }))
    .sort((a, b) => a.key - b.key || a.problem.id.localeCompare(b.problem.id))
    .slice(0, Math.min(count, algorithmProblems.length))
    .map(({ problem }) => ({
      id: problem.id,
      prompt: problem.prompt,
      options: algorithmPatternIds
        .filter((id) => id !== problem.primaryPatternId)
        .slice(0, 3)
        .concat(problem.primaryPatternId)
        .sort((a, b) => hash(seed + a.length) - hash(seed + b.length)),
      acceptedPatternIds: problem.acceptedPatternIds,
    }));
}
