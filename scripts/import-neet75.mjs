import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const activeUrl = new URL('src/data/neet75-problems.json', root);
const coveredUrl = new URL('src/data/covered-blind75.json', root);
const endpoint = 'https://neetcode.io/api/getProblemMetadataFunctionHttp';

const manifest = [
  ['Arrays & Hashing', 'valid-sudoku'],
  ['Two Pointers', 'two-integer-sum-ii'],
  ['Two Pointers', 'trapping-rain-water'],
  ['Sliding Window', 'permutation-string'],
  ['Sliding Window', 'sliding-window-maximum'],
  ['Stack', 'minimum-stack'],
  ['Stack', 'evaluate-reverse-polish-notation'],
  ['Stack', 'daily-temperatures'],
  ['Stack', 'car-fleet'],
  ['Stack', 'largest-rectangle-in-histogram'],
  ['Binary Search', 'binary-search'],
  ['Binary Search', 'search-2d-matrix'],
  ['Binary Search', 'eating-bananas'],
  ['Binary Search', 'time-based-key-value-store'],
  ['Binary Search', 'median-of-two-sorted-arrays'],
  ['Linked List', 'copy-linked-list-with-random-pointer'],
  ['Linked List', 'add-two-numbers'],
  ['Linked List', 'find-duplicate-integer'],
  ['Linked List', 'lru-cache'],
  ['Linked List', 'reverse-nodes-in-k-group'],
  ['Trees', 'binary-tree-diameter'],
  ['Trees', 'balanced-binary-tree'],
  ['Trees', 'binary-tree-right-side-view'],
  ['Trees', 'count-good-nodes-in-binary-tree'],
  ['Heap / Priority Queue', 'kth-largest-integer-in-a-stream'],
  ['Heap / Priority Queue', 'last-stone-weight'],
  ['Heap / Priority Queue', 'k-closest-points-to-origin'],
  ['Heap / Priority Queue', 'kth-largest-element-in-an-array'],
  ['Heap / Priority Queue', 'task-scheduling'],
  ['Heap / Priority Queue', 'design-twitter-feed'],
  ['Backtracking', 'subsets'],
  ['Backtracking', 'combination-target-sum-ii'],
  ['Backtracking', 'permutations'],
  ['Backtracking', 'subsets-ii'],
  ['Backtracking', 'generate-parentheses'],
  ['Backtracking', 'palindrome-partitioning'],
  ['Backtracking', 'combinations-of-a-phone-number'],
  ['Backtracking', 'n-queens'],
  ['Graphs', 'max-area-of-island'],
  ['Graphs', 'islands-and-treasure'],
  ['Graphs', 'rotting-fruit'],
  ['Graphs', 'surrounded-regions'],
  ['Graphs', 'course-schedule-ii'],
  ['Graphs', 'redundant-connection'],
  ['Graphs', 'word-ladder'],
  ['Advanced Graphs', 'network-delay-time'],
  ['Advanced Graphs', 'reconstruct-flight-path'],
  ['Advanced Graphs', 'min-cost-to-connect-points'],
  ['Advanced Graphs', 'swim-in-rising-water'],
  ['Advanced Graphs', 'cheapest-flight-path'],
  ['1-D Dynamic Programming', 'min-cost-climbing-stairs'],
  ['1-D Dynamic Programming', 'partition-equal-subset-sum'],
  ['2-D Dynamic Programming', 'buy-and-sell-crypto-with-cooldown'],
  ['2-D Dynamic Programming', 'coin-change-ii'],
  ['2-D Dynamic Programming', 'target-sum'],
  ['2-D Dynamic Programming', 'interleaving-string'],
  ['2-D Dynamic Programming', 'longest-increasing-path-in-matrix'],
  ['2-D Dynamic Programming', 'count-subsequences'],
  ['2-D Dynamic Programming', 'edit-distance'],
  ['2-D Dynamic Programming', 'burst-balloons'],
  ['2-D Dynamic Programming', 'regular-expression-matching'],
  ['Greedy', 'jump-game-ii'],
  ['Greedy', 'gas-station'],
  ['Greedy', 'hand-of-straights'],
  ['Greedy', 'merge-triplets-to-form-target'],
  ['Greedy', 'partition-labels'],
  ['Greedy', 'valid-parenthesis-string'],
  ['Intervals', 'minimum-interval-including-query'],
  ['Math & Geometry', 'non-cyclical-number'],
  ['Math & Geometry', 'plus-one'],
  ['Math & Geometry', 'pow-x-n'],
  ['Math & Geometry', 'multiply-strings'],
  ['Math & Geometry', 'count-squares'],
  ['Bit Manipulation', 'single-number'],
  ['Bit Manipulation', 'reverse-integer'],
];

const caseFixes = {
  'swim-in-rising-water': (raw) => raw.replace(/\]\]\]$/, ']]'),
};

const solutionFixes = {
  'copy-linked-list-with-random-pointer': () => `func copyRandomList(head *Node) *Node {
    if head == nil { return nil }
    for current := head; current != nil; {
        next := current.Next
        current.Next = &Node{Val: current.Val, Next: next}
        current = next
    }
    for current := head; current != nil; current = current.Next.Next {
        if current.Random != nil { current.Next.Random = current.Random.Next }
    }
    copiedHead := head.Next
    for current := head; current != nil; {
        copied := current.Next
        current.Next = copied.Next
        if copied.Next != nil { copied.Next = copied.Next.Next }
        current = current.Next
    }
    return copiedHead
}
`,
  'subsets-ii': (source) => source.replace('tmp := append([]int(nil), subset...)', 'tmp := make([]int, len(subset))\n            copy(tmp, subset)'),
  'edit-distance': (source) => source
    .replaceAll('[][]float64', '[][]int')
    .replaceAll('[]float64', '[]int')
    .replaceAll('math.Inf(1)', 'len(word1) + len(word2)')
    .replaceAll('float64(len(word2) - j)', 'len(word2) - j')
    .replaceAll('float64(len(word1) - i)', 'len(word1) - i'),
};

function cleanStatement(description) {
  const details = description.indexOf('<details');
  const body = (details >= 0 ? description.slice(0, details) : description)
    .replace(/!\[[^\]]*\]\([^\n)]+\)\s*/g, '')
    .replace(/<img\b[^>]*>\s*/gis, '')
    .replace(/<br\s*\/?>/gi, '')
    .replace(/```(?:java|python|cpp|javascript)/g, '```go')
    .replace(/\$([^$\n]+)\$/g, (_, expression) => `\`${expression.replace(/\\times/g, '×').replace(/\s+\*\s+/g, ' × ')}\``)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return body;
}

async function fetchProblem([category, id]) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ data: { problemId: id } }),
  });
  if (!response.ok) throw new Error(`${id}: metadata request failed with ${response.status}`);
  const { data } = await response.json();
  if (!data?.starterCode?.go || !data?.solutions?.go) throw new Error(`${id}: missing Go starter or reference solution`);
  return {
    title: data.name,
    category,
    difficulty: data.difficulty,
    id,
    statement: cleanStatement(data.description),
    starterCode: data.starterCode.go,
    referenceCode: solutionFixes[id]?.(data.solutions.go) ?? data.solutions.go,
    customTestCases: (data.custom_test_cases ?? []).map((raw) => caseFixes[id]?.(raw) ?? raw),
  };
}

const covered = JSON.parse(await readFile(coveredUrl, 'utf8'));
if (covered.problems?.length !== 75) {
  throw new Error('The covered Blind 75 manifest must contain exactly 75 problems.');
}
const importedAt = new Date().toISOString();
const problems = [];
for (let start = 0; start < manifest.length; start += 8) {
  problems.push(...await Promise.all(manifest.slice(start, start + 8).map(fetchProblem)));
}

const active = {
  importedAt,
  source: 'https://neetcode.io/practice/practice/neetcode150',
  description: 'The NeetCode 150 problems not included in the Blind 75',
  problems,
};

await writeFile(activeUrl, `${JSON.stringify(active, null, 2)}\n`);
console.log(`Imported ${problems.length} active problems; retained ${covered.problems.length} covered problems.`);
