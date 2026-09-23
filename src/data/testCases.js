// Extra cases are deliberately local and visible. Official metadata generally
// supplies one or two examples; these complete every problem to three cases.
export const EXTRA_TEST_CASES = {
  'valid-sudoku': ['board=[[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."]]'],
  'two-integer-sum-ii': ['numbers=[2,3,4]\ntarget=6', 'numbers=[-1,0]\ntarget=-1'],
  'trapping-rain-water': ['height=[1,2]', 'height=[4,2,0,3,2,5]'],
  'permutation-string': ['s1="abc"\ns2="bbbca"'],
  'sliding-window-maximum': ['nums=[1]\nk=1', 'nums=[9,8,7,6]\nk=2'],
  'evaluate-reverse-polish-notation': ['tokens=["4","13","5","/","+"]', 'tokens=["3","-4","+"]'],
  'daily-temperatures': ['temperatures=[30]'],
  'car-fleet': ['target=12\nposition=[10,8,0,5,3]\nspeed=[2,4,1,1,3]'],
  'largest-rectangle-in-histogram': ['heights=[2,4]'],
  'binary-search': ['nums=[5]\ntarget=5'],
  'search-2d-matrix': ['matrix=[[1]]\ntarget=0'],
  'eating-bananas': ['piles=[1,1,1]\nh=3'],
  'median-of-two-sorted-arrays': ['nums1=[]\nnums2=[2,3]'],
  'copy-linked-list-with-random-pointer': ['head=[]'],
  'add-two-numbers': ['l1=[0]\nl2=[0]'],
  'find-duplicate-integer': ['nums=[1,1]'],
  'reverse-nodes-in-k-group': ['head=[1,2,3]\nk=1'],
  'binary-tree-diameter': ['root=[]'],
  'binary-tree-right-side-view': ['root=[]'],
  'count-good-nodes-in-binary-tree': ['root=[1]'],
  'last-stone-weight': ['stones=[1]'],
  'k-closest-points-to-origin': ['points=[[1,1],[1,-1]]\nk=1'],
  'kth-largest-element-in-an-array': ['nums=[1]\nk=1'],
  'task-scheduling': ['tasks=["A"]\nn=10'],
  subsets: ['nums=[]'],
  'combination-target-sum-ii': ['candidates=[2,5,2,1,2]\ntarget=5'],
  permutations: ['nums=[]'],
  'subsets-ii': ['nums=[]'],
  'generate-parentheses': ['n=2'],
  'palindrome-partitioning': ['s="abba"'],
  'combinations-of-a-phone-number': ['digits="2"'],
  'n-queens': ['n=2'],
  'max-area-of-island': ['grid=[[0]]', 'grid=[[1]]'],
  'islands-and-treasure': ['grid=[[2147483647]]'],
  'rotting-fruit': ['grid=[[0]]'],
  'surrounded-regions': ['board=[["O"]]'],
  'course-schedule-ii': ['numCourses=1\nprerequisites=[]'],
  'redundant-connection': ['edges=[[1,2],[2,3],[3,1]]'],
  'word-ladder': ['beginWord="a"\nendWord="c"\nwordList=["a","b","c"]'],
  'network-delay-time': ['times=[]\nn=1\nk=1'],
  'reconstruct-flight-path': ['tickets=[["JFK","A"],["A","JFK"]]'],
  'min-cost-to-connect-points': ['points=[[0,0]]', 'points=[[0,0],[3,4]]'],
  'swim-in-rising-water': ['grid=[[0]]'],
  'cheapest-flight-path': ['n=3\nflights=[[0,1,5]]\nsrc=0\ndst=2\nk=1'],
  'min-cost-climbing-stairs': ['cost=[10,15]'],
  'partition-equal-subset-sum': ['nums=[2,2]'],
  'buy-and-sell-crypto-with-cooldown': ['prices=[2,1,4]'],
  'coin-change-ii': ['amount=0\ncoins=[1,2]'],
  'target-sum': ['nums=[1]\ntarget=1', 'nums=[1]\ntarget=2'],
  'longest-increasing-path-in-matrix': ['matrix=[[1]]'],
  'count-subsequences': ['s="abc"\nt=""'],
  'edit-distance': ['word1=""\nword2="abc"'],
  'burst-balloons': ['nums=[]', 'nums=[1]'],
  'jump-game-ii': ['nums=[0]'],
  'gas-station': ['gas=[5]\ncost=[4]'],
  'hand-of-straights': ['hand=[1,2,3]\ngroupSize=1'],
  'merge-triplets-to-form-target': ['triplets=[[1,1,1]]\ntarget=[1,1,1]'],
  'partition-labels': ['s="a"'],
  'valid-parenthesis-string': ['s=""'],
  'minimum-interval-including-query': ['intervals=[[1,1]]\nqueries=[1]', 'intervals=[[2,3]]\nqueries=[1]'],
  'non-cyclical-number': ['n=1'],
  'plus-one': ['digits=[0]'],
  'multiply-strings': ['num1="0"\nnum2="999"'],
  'single-number': ['nums=[1]'],
};

// Design problems use one normalized representation: an operation array and
// a parallel argument array. The first argument entry belongs to Constructor.
export const CLASS_TEST_CASES = {
  'minimum-stack': [
    '["MinStack","Push","Push","Push","GetMin","Pop","Top","GetMin"]\n[[],[1],[2],[0],[],[],[],[]]',
    '["MinStack","Push","Push","GetMin","Top","Pop","GetMin"]\n[[],[-2],[-3],[],[],[],[]]',
    '["MinStack","Push","Push","GetMin","Pop","GetMin"]\n[[],[5],[5],[],[],[]]',
  ],
  'time-based-key-value-store': [
    '["TimeMap","Set","Get","Get","Set","Get"]\n[[],["alice","happy",1],["alice",1],["alice",2],["alice","sad",3],["alice",3]]',
    '["TimeMap","Get","Set","Get"]\n[[],["missing",10],["k","v",5],["k",4]]',
    '["TimeMap","Set","Set","Get","Get"]\n[[],["a","x",1],["b","y",2],["a",9],["b",2]]',
  ],
  'kth-largest-integer-in-a-stream': [
    '["KthLargest","Add","Add","Add","Add","Add"]\n[[3,[1,2,3,3]],[3],[5],[6],[7],[8]]',
    '["KthLargest","Add","Add"]\n[[1,[]],[-2],[4]]',
    '["KthLargest","Add","Add","Add"]\n[[2,[5,5]],[5],[6],[4]]',
  ],
  'lru-cache': [
    '["LRUCache","Put","Get","Put","Put","Get","Get"]\n[[2],[1,10],[1],[2,20],[3,30],[2],[1]]',
    '["LRUCache","Put","Put","Get","Get"]\n[[1],[1,1],[2,2],[1],[2]]',
    '["LRUCache","Put","Put","Get"]\n[[2],[1,1],[1,9],[1]]',
  ],
  'design-twitter-feed': [
    '["Twitter","PostTweet","PostTweet","GetNewsFeed","Follow","GetNewsFeed","Unfollow","GetNewsFeed"]\n[[],[1,10],[2,20],[1],[1,2],[1],[1,2],[1]]',
    '["Twitter","PostTweet","GetNewsFeed"]\n[[],[7,99],[7]]',
    '["Twitter","Follow","PostTweet","GetNewsFeed"]\n[[],[1,2],[2,5],[1]]',
  ],
  'count-squares': [
    '["CountSquares","Add","Add","Add","Count","Count","Add","Count"]\n[[],[[1,1]],[[2,2]],[[1,2]],[[2,1]],[[3,3]],[[2,2]],[[2,1]]]',
    '["CountSquares","Add","Add","Add","Count"]\n[[],[[0,0]],[[1,0]],[[0,1]],[[1,1]]]',
    '["CountSquares","Count"]\n[[],[[5,5]]]',
  ],
};

export function getThreeTestCases(problem) {
  const cases = CLASS_TEST_CASES[problem.id]
    ?? [...(problem.customTestCases ?? []), ...(EXTRA_TEST_CASES[problem.id] ?? [])].slice(0, 3);
  if (cases.length !== 3) throw new Error(`No complete three-case fixture exists for ${problem.id}.`);
  return cases;
}
