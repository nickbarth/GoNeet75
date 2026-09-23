import snapshot from '../src/data/neet75-problems.json' with { type: 'json' };
import covered from '../src/data/covered-blind75.json' with { type: 'json' };
import { getThreeTestCases } from '../src/data/testCases.js';
import { buildProgram } from '../src/lib/goProgram.js';
import { matches } from '../src/lib/resultMatcher.js';

const failures = [];
const expectedActiveIds = new Set(`
valid-sudoku
two-integer-sum-ii
trapping-rain-water
permutation-string
sliding-window-maximum
minimum-stack
evaluate-reverse-polish-notation
daily-temperatures
car-fleet
largest-rectangle-in-histogram
binary-search
search-2d-matrix
eating-bananas
time-based-key-value-store
median-of-two-sorted-arrays
copy-linked-list-with-random-pointer
add-two-numbers
find-duplicate-integer
lru-cache
reverse-nodes-in-k-group
binary-tree-diameter
balanced-binary-tree
binary-tree-right-side-view
count-good-nodes-in-binary-tree
kth-largest-integer-in-a-stream
last-stone-weight
k-closest-points-to-origin
kth-largest-element-in-an-array
task-scheduling
design-twitter-feed
subsets
combination-target-sum-ii
permutations
subsets-ii
generate-parentheses
palindrome-partitioning
combinations-of-a-phone-number
n-queens
max-area-of-island
islands-and-treasure
rotting-fruit
surrounded-regions
course-schedule-ii
redundant-connection
word-ladder
network-delay-time
reconstruct-flight-path
min-cost-to-connect-points
swim-in-rising-water
cheapest-flight-path
min-cost-climbing-stairs
partition-equal-subset-sum
buy-and-sell-crypto-with-cooldown
coin-change-ii
target-sum
interleaving-string
longest-increasing-path-in-matrix
count-subsequences
edit-distance
burst-balloons
regular-expression-matching
jump-game-ii
gas-station
hand-of-straights
merge-triplets-to-form-target
partition-labels
valid-parenthesis-string
minimum-interval-including-query
non-cyclical-number
plus-one
pow-x-n
multiply-strings
count-squares
single-number
reverse-integer
`.trim().split(/\s+/));
const expectedCategories = {
  'Arrays & Hashing': 1, 'Two Pointers': 2, 'Sliding Window': 2, Stack: 5, 'Binary Search': 5,
  'Linked List': 5, Trees: 4, 'Heap / Priority Queue': 6, Backtracking: 8, Graphs: 7,
  'Advanced Graphs': 5, '1-D Dynamic Programming': 2, '2-D Dynamic Programming': 9,
  Greedy: 6, Intervals: 1, 'Math & Geometry': 5, 'Bit Manipulation': 2,
};
const activeIds = new Set(snapshot.problems.map(({ id }) => id));
const coveredIds = new Set(covered.problems.map(({ id }) => id));
if (snapshot.problems.length !== 75) failures.push(`active problem count is ${snapshot.problems.length}, want 75`);
if (covered.problems.length !== 75) failures.push(`covered problem count is ${covered.problems.length}, want 75`);
if (activeIds.size !== 75) failures.push('active problem IDs are not unique');
if (coveredIds.size !== 75) failures.push('covered problem IDs are not unique');
for (const id of expectedActiveIds) if (!activeIds.has(id)) failures.push(`${id}: pinned active problem is missing`);
for (const id of activeIds) if (!expectedActiveIds.has(id)) failures.push(`${id}: active problem is not in the pinned manifest`);
for (const id of activeIds) if (coveredIds.has(id)) failures.push(`${id}: active and covered problem sets overlap`);
const categoryCounts = Object.fromEntries(Object.keys(expectedCategories).map((category) => [category, snapshot.problems.filter((problem) => problem.category === category).length]));
if (JSON.stringify(categoryCounts) !== JSON.stringify(expectedCategories)) failures.push(`category counts differ: ${JSON.stringify(categoryCounts)}`);
const difficultyCounts = Object.fromEntries(['Easy', 'Medium', 'Hard'].map((difficulty) => [difficulty, snapshot.problems.filter((problem) => problem.difficulty === difficulty).length]));
if (JSON.stringify(difficultyCounts) !== JSON.stringify({ Easy: 9, Medium: 52, Hard: 14 })) failures.push(`difficulty counts differ: ${JSON.stringify(difficultyCounts)}`);
for (const problem of snapshot.problems) {
  for (const field of ['id', 'title', 'category', 'difficulty', 'statement', 'starterCode', 'referenceCode']) if (!problem[field]) failures.push(`${problem.id || '<unknown>'}: missing ${field}`);
  if (/\$[^$\n]+\$/.test(problem.statement)) failures.push(`${problem.id}: statement contains unsupported dollar-delimited math`);
  if (!problem.starterCode.includes('func ') && !problem.starterCode.includes('type ')) failures.push(`${problem.id}: missing Go starter code`);
  for (const raw of getThreeTestCases(problem)) {
    try {
      buildProgram(problem, problem.referenceCode, raw);
    } catch (error) {
      failures.push(`${problem.id}: ${raw} => ${error.message}`);
    }
  }
}
const course = { id: 'course-schedule-ii' };
if (!matches(course, [0, 2, 1], [0, 1, 2], 'numCourses=3\nprerequisites=[[1,0]]')) failures.push('course-schedule-ii: alternate valid order should pass');
if (matches(course, [1, 0, 2], [0, 1, 2], 'numCourses=3\nprerequisites=[[1,0]]')) failures.push('course-schedule-ii: invalid prerequisite order should fail');
const points = { id: 'k-closest-points-to-origin' };
if (!matches(points, [[1, -1]], [[1, 1]], 'points=[[1,1],[1,-1]]\nk=1')) failures.push('k-closest-points-to-origin: tied valid point should pass');
if (matches(points, [[3, 3]], [[1, 1]], 'points=[[1,1],[3,3]]\nk=1')) failures.push('k-closest-points-to-origin: farther point should fail');
if (failures.length) throw new Error(`Fixture verification failed:\n${failures.join('\n')}`);
console.log(`Verified ${snapshot.problems.length} Go problems and ${snapshot.problems.length * 3} generated Go test programs.`);
process.exit(0);
