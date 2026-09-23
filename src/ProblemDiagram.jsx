const diagramByProblemId = {
  'valid-sudoku': 'sudoku',
  'trapping-rain-water': 'rain',
  'sliding-window-maximum': 'window',
  'daily-temperatures': 'histogram',
  'largest-rectangle-in-histogram': 'histogram',
  'search-2d-matrix': 'matrix',
  'copy-linked-list-with-random-pointer': 'random-list',
  'add-two-numbers': 'linked-list',
  'reverse-nodes-in-k-group': 'linked-list',
  'binary-tree-diameter': 'tree',
  'balanced-binary-tree': 'tree',
  'binary-tree-right-side-view': 'tree',
  'count-good-nodes-in-binary-tree': 'tree',
  'k-closest-points-to-origin': 'points',
  'n-queens': 'queens',
  'max-area-of-island': 'grid',
  'islands-and-treasure': 'grid',
  'rotting-fruit': 'grid',
  'surrounded-regions': 'grid',
  'course-schedule-ii': 'directed-graph',
  'redundant-connection': 'directed-graph',
  'word-ladder': 'directed-graph',
  'network-delay-time': 'weighted-graph',
  'reconstruct-flight-path': 'route',
  'min-cost-to-connect-points': 'weighted-graph',
  'swim-in-rising-water': 'grid',
  'cheapest-flight-path': 'weighted-graph',
  'longest-increasing-path-in-matrix': 'grid',
  'minimum-interval-including-query': 'intervals',
  'count-squares': 'points',
};

const titles = {
  sudoku: 'Sudoku row, column, and box diagram',
  rain: 'Trapped rain water diagram',
  window: 'Sliding window diagram',
  histogram: 'Histogram and monotonic stack diagram',
  matrix: 'Matrix search diagram',
  'random-list': 'Linked list with random pointers',
  'linked-list': 'Linked list transformation diagram',
  tree: 'Binary tree diagram',
  points: 'Coordinate points diagram',
  queens: 'N Queens board',
  grid: 'Grid traversal diagram',
  'directed-graph': 'Directed graph diagram',
  'weighted-graph': 'Weighted graph diagram',
  route: 'Flight route diagram',
  intervals: 'Intervals and query diagram',
};

function Node({ x, y, value, accent = false }) {
  return <g><circle cx={x} cy={y} r="14" className={accent ? 'diagram-node accent' : 'diagram-node'} /><text x={x} y={y + 4} textAnchor="middle">{value}</text></g>;
}

function SquareGrid({ size = 4, x = 70, y = 25, cell = 40 }) {
  const lines = [];
  for (let index = 0; index <= size; index += 1) {
    lines.push(<path key={`v-${index}`} d={`M${x + index * cell} ${y}v${size * cell}`} />);
    lines.push(<path key={`h-${index}`} d={`M${x} ${y + index * cell}h${size * cell}`} />);
  }
  return <g className="diagram-grid">{lines}</g>;
}

function Tree() {
  return <g><g className="diagram-line"><path d="M160 44 100 94M160 44l60 50M100 94l-35 52M100 94l35 52M220 94l-35 52M220 94l35 52" /></g>
    <Node x={160} y={34} value="5" accent /><Node x={100} y={84} value="3" /><Node x={220} y={84} value="8" />
    <Node x={65} y={136} value="1" /><Node x={135} y={136} value="4" /><Node x={185} y={136} value="7" /><Node x={255} y={136} value="9" />
  </g>;
}

function Graph({ weighted = false, route = false }) {
  if (route) return <g><path className="diagram-line" d="M55 120C90 25 140 25 165 105S250 185 280 80" markerEnd="url(#accent-arrow)" />
    <Node x={50} y={125} value="JFK" accent /><Node x={165} y={105} value="ATL" /><Node x={280} y={75} value="SFO" />
  </g>;
  return <g>
    <path className="diagram-line" d="M70 105 155 45M70 105l90 65M155 45l95 65M160 170l90-60M155 45l5 125" markerEnd="url(#arrow)" />
    <Node x={65} y={105} value="0" /><Node x={155} y={40} value="1" accent /><Node x={255} y={110} value="2" /><Node x={160} y={175} value="3" />
    {weighted && <g className="diagram-label"><text x="100" y="65">4</text><text x="205" y="65">2</text><text x="208" y="152">1</text></g>}
  </g>;
}

function Diagram({ kind, problemId }) {
  if (kind === 'sudoku') return <g><path className="diagram-found-cell" d="M70 25h53v53H70z" /><SquareGrid size={9} x={70} y={25} cell={18} />
    <path className="accent-line" d="M124 25v162M178 25v162M70 79h162M70 133h162" />
    <g className="diagram-label"><text x="79" y="43">5</text><text x="97" y="43">3</text><text x="133" y="61">7</text><text x="187" y="97">6</text></g>
  </g>;
  if (kind === 'rain') return <g><path className="diagram-water" d="M65 72h180v90H65z" /><g className="diagram-bar"><path d="M45 162V130M75 162V55M105 162V125M135 162V92M165 162V138M195 162V75M225 162V112M255 162V45" /></g><path className="diagram-line" d="M35 162h240" /><text x="155" y="115" textAnchor="middle">water</text></g>;
  if (kind === 'window') return <g><path className="diagram-grid" d="M35 80h250v50H35zM85 80v50M135 80v50M185 80v50M235 80v50" /><path className="diagram-found-cell" d="M86 81h99v48H86z" /><g className="diagram-label"><text x="60" y="112">1</text><text x="110" y="112">3</text><text x="160" y="112">-1</text><text x="210" y="112">5</text><text x="260" y="112">2</text></g><path className="accent-line" d="M95 150h80" markerEnd="url(#accent-arrow)" /></g>;
  if (kind === 'histogram') return <g><path className="diagram-found-cell" d="M105 80h70v85h-70z" /><path className="diagram-bar" d="M45 165V130M75 165V80M105 165V45M140 165V80M175 165V105M210 165V55M245 165V120" /><path className="diagram-line" d="M30 165h240" /></g>;
  if (kind === 'matrix') return <g><SquareGrid size={4} x={80} y={25} cell={40} /><path className="accent-line" d="M100 45h120v40H100v40h120v40H100" markerEnd="url(#accent-arrow)" /><g className="diagram-label"><text x="100" y="50">1</text><text x="140" y="50">3</text><text x="180" y="50">5</text><text x="220" y="50">7</text></g></g>;
  if (kind === 'linked-list') return <g><path className="diagram-line" d="M65 75h45m30 0h45m30 0h45M65 140h45m30 0h45m30 0h45" markerEnd="url(#arrow)" /><Node x={50} y={75} value="1" /><Node x={125} y={75} value="2" /><Node x={200} y={75} value="3" /><Node x={275} y={75} value="4" /><Node x={50} y={140} value="2" accent /><Node x={125} y={140} value="1" accent /><Node x={200} y={140} value="4" accent /><Node x={275} y={140} value="3" accent /></g>;
  if (kind === 'random-list') return <g><path className="diagram-line" d="M75 90h55m30 0h55" markerEnd="url(#arrow)" /><path className="accent-line" d="M60 106c20 65 150 65 170 0M145 74c-20-45-80-45-85 0" markerEnd="url(#accent-arrow)" /><Node x={60} y={90} value="3" /><Node x={145} y={90} value="7" /><Node x={230} y={90} value="4" /></g>;
  if (kind === 'tree') return <Tree />;
  if (kind === 'queens') return <g><SquareGrid size={4} x={80} y={25} cell={40} /><g className="diagram-label"><text x="100" y="52">♛</text><text x="220" y="92">♛</text><text x="140" y="132">♛</text><text x="180" y="172">♛</text></g></g>;
  if (kind === 'grid') return <g><path className="diagram-found-cell" d="M70 65h40v40h40v40h40v-40h40v40h40v40H70z" /><SquareGrid size={5} x={70} y={5} cell={40} /><path className="accent-line" d="M90 185v-60h40V85h40V45h80" markerEnd="url(#accent-arrow)" /></g>;
  if (kind === 'directed-graph') return <Graph />;
  if (kind === 'weighted-graph') return <Graph weighted />;
  if (kind === 'route') return <Graph route />;
  if (kind === 'intervals') return <g><path className="diagram-line" d="M35 170h250M55 70h85M95 105h120M165 140h90" /><path className="accent-line" d="M180 40v135" /><circle cx="180" cy="170" r="5" className="diagram-node accent" /><g className="diagram-label"><text x="182" y="30">query</text><text x="38" y="74">[1,4]</text><text x="78" y="109">[3,8]</text><text x="148" y="144">[7,10]</text></g></g>;
  return <g><path className="diagram-line" d="M45 165h235M70 185V25" /><path className="accent-line" d="M105 125h80v-80h-80z" /><Node x={105} y={125} value="" /><Node x={185} y={125} value="" /><Node x={105} y={45} value="" /><Node x={185} y={45} value="" /></g>;
}

export function ProblemDiagram({ problemId }) {
  const kind = diagramByProblemId[problemId];
  if (!kind) return null;
  return <figure className="problem-diagram"><svg viewBox="0 0 320 210" role="img" aria-label={titles[kind]}><defs>
    <marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path className="diagram-arrowhead" d="M0 0 7 3.5 0 7z" /></marker>
    <marker id="accent-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path className="diagram-accent-arrowhead" d="M0 0 7 3.5 0 7z" /></marker>
  </defs><Diagram kind={kind} problemId={problemId} /></svg><figcaption>{titles[kind]}</figcaption></figure>;
}
