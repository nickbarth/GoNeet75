const RESULT = '__GONEET75_RESULT__';
const ERROR = '__GONEET75_ERROR__';

function preludeFor(problem, code) {
  const imports = ['"encoding/json"', '"fmt"'];
  const packageFor = { heap: '"container/heap"', math: '"math"', sort: '"sort"', strconv: '"strconv"', strings: '"strings"' };
  for (const [name, source] of Object.entries(packageFor)) if (new RegExp(`\\b${name}\\.`).test(code)) imports.push(source);
  if (/\bmaps\s*\.\s*Equal\s*\(/.test(code) || /\bcmp\s*\.\s*Or\s*\(/.test(code)) imports.push('"reflect"');
  if ((/\bslices\s*\.\s*Sort(?:Func)?\s*\(/.test(code) || /\bcmp\s*\.\s*(?:Compare|Or)\s*\(/.test(code)) && !imports.includes('"sort"')) imports.push('"sort"');
  const helpers = [];
  if (/\bmaps\s*\.\s*Equal\s*\(/.test(code)) helpers.push('func mapsEqual(left, right any) bool { return reflect.DeepEqual(left, right) }');
  if (/\bslices\s*\.\s*Sort\s*\(/.test(code) || /\bcmp\s*\.\s*(?:Compare|Or)\s*\(/.test(code)) helpers.push(`type goneet75Ordered interface { ~int | ~int8 | ~int16 | ~int32 | ~int64 | ~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64 | ~uintptr | ~float32 | ~float64 | ~string }
func goneet75SlicesSort[T goneet75Ordered](values []T) { sort.Slice(values, func(i, j int) bool { return values[i] < values[j] }) }
func goneet75CmpCompare[T goneet75Ordered](left, right T) int { if left < right { return -1 }; if left > right { return 1 }; return 0 }
func goneet75CmpOr[T any](first, second T) T { var zero T; if !reflect.DeepEqual(first, zero) { return first }; return second }`);
  if (/\bslices\s*\.\s*SortFunc\s*\(/.test(code)) helpers.push('func goneet75SlicesSortFunc[T any](values []T, compare func(T, T) int) { sort.Slice(values, func(i, j int) bool { return compare(values[i], values[j]) < 0 }) }');
  if (/\bslices\s*\.\s*Reverse\s*\(/.test(code)) helpers.push('func goneet75SlicesReverse[T any](values []T) { for i, j := 0, len(values)-1; i < j; i, j = i+1, j-1 { values[i], values[j] = values[j], values[i] } }');
  if (/ListNode/.test(problem.starterCode)) helpers.push(`type ListNode struct { Val int; Next *ListNode }
func listFrom(values []int) *ListNode { if len(values) == 0 { return nil }; dummy := &ListNode{}; current := dummy; for _, value := range values { current.Next = &ListNode{Val: value}; current = current.Next }; return dummy.Next }
func listValue(head *ListNode) []int { output := []int{}; seen := map[*ListNode]bool{}; for head != nil && !seen[head] { seen[head] = true; output = append(output, head.Val); head = head.Next }; return output }`);
  if (/TreeNode/.test(problem.starterCode)) helpers.push(`type TreeNode struct { Val int; Left *TreeNode; Right *TreeNode }
func treeFrom(values []any) *TreeNode { if len(values) == 0 || values[0] == nil { return nil }; root := &TreeNode{Val: values[0].(int)}; queue := []*TreeNode{root}; for index := 1; index < len(values) && len(queue) > 0; { node := queue[0]; queue = queue[1:]; if values[index] != nil { node.Left = &TreeNode{Val: values[index].(int)}; queue = append(queue, node.Left) }; index++; if index < len(values) { if values[index] != nil { node.Right = &TreeNode{Val: values[index].(int)}; queue = append(queue, node.Right) }; index++ } }; return root }
func treeValue(root *TreeNode) []any { if root == nil { return []any{} }; output := []any{}; queue := []*TreeNode{root}; for len(queue) > 0 { node := queue[0]; queue = queue[1:]; if node == nil { output = append(output, nil); continue }; output = append(output, node.Val); queue = append(queue, node.Left, node.Right) }; for len(output) > 0 && output[len(output)-1] == nil { output = output[:len(output)-1] }; return output }`);
  if (problem.id === 'copy-linked-list-with-random-pointer') helpers.push(`type Node struct { Val int; Next *Node; Random *Node }
func randomListFrom(values [][]any) *Node { if len(values) == 0 { return nil }; nodes := make([]*Node, len(values)); for i, value := range values { nodes[i] = &Node{Val: value[0].(int)}; if i > 0 { nodes[i-1].Next = nodes[i] } }; for i, value := range values { if len(value) > 1 && value[1] != nil { nodes[i].Random = nodes[value[1].(int)] } }; return nodes[0] }
func randomListValue(head *Node) [][]any { nodes := []*Node{}; indexes := map[*Node]int{}; for node := head; node != nil; node = node.Next { indexes[node] = len(nodes); nodes = append(nodes, node) }; output := make([][]any, len(nodes)); for i, node := range nodes { var random any; if node.Random != nil { if index, ok := indexes[node.Random]; ok { random = index } }; output[i] = []any{node.Val, random} }; return output }`);
  if (/\[\]\[\]byte/.test(problem.starterCode)) helpers.push(`func byteGridValue(grid [][]byte) [][]string { output := make([][]string, len(grid)); for row := range grid { output[row] = make([]string, len(grid[row])); for column, value := range grid[row] { output[row][column] = string(value) } }; return output }`);
  const minShim = /func\s+min\s*\(/.test(code) ? '' : 'func min(values ...int) int { result := values[0]; for _, value := range values[1:] { if value < result { result = value } }; return result }';
  const maxShim = /func\s+max\s*\(/.test(code) ? '' : 'func max(values ...int) int { result := values[0]; for _, value := range values[1:] { if value > result { result = value } }; return result }';
  return `package main\n\nimport (\n  ${imports.join('\n  ')}\n)\n\n${minShim}\n${maxShim}\n\n${helpers.join('\n\n')}\n\nfunc emitResult(value any) { encoded, err := json.Marshal(value); if err != nil { fmt.Printf("${ERROR}%s\\n", err); return }; fmt.Printf("${RESULT}%s\\n", encoded) }\n`;
}

function rewriteRangeIntegerLoops(source) {
  const scalarNames = new Set(['amount', 'k', 'length', 'limit', 'n', 'num', 'size', 'steps', 'total']);
  for (const match of source.matchAll(/\b(?:var\s+)?([A-Za-z_]\w*)\s*(?::=|=)\s*(?:len\([^)]*\)|-?\d+(?:\.\d+)?)\b/g)) scalarNames.add(match[1]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const match of source.matchAll(/\b(?:var\s+)?([A-Za-z_]\w*)\s*(?::=|=)\s*([A-Za-z_]\w*)\b/g)) {
      if (scalarNames.has(match[2]) && !scalarNames.has(match[1])) { scalarNames.add(match[1]); changed = true; }
    }
  }
  for (const match of source.matchAll(/\b([A-Za-z_]\w*)\s+(?:u?int(?:8|16|32|64)?|float(?:32|64)?)\b/g)) scalarNames.add(match[1]);
  let rewritten = source.replace(/for\s+([A-Za-z_]\w*)\s*:=\s*range\s+len\(([^()\n]+)\)\s*\{/g, 'for $1 := 0; $1 < len($2); $1++ {');
  rewritten = rewritten.replace(/for\s+([A-Za-z_]\w*)\s*:=\s*range\s+(-?\d+)\s*\{/g, 'for $1 := 0; $1 < $2; $1++ {');
  return rewritten.replace(/for\s+([A-Za-z_]\w*)\s*:=\s*range\s+([A-Za-z_]\w*)\s*\{/g, (full, index, bound) => scalarNames.has(bound) ? `for ${index} := 0; ${index} < ${bound}; ${index}++ {` : full);
}

function parseValue(source) {
  const value = source.trim();
  if (/^[01]{8,}$/.test(value)) return Number.parseInt(value, 2);
  return JSON.parse(value.replace(/\((-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)\)/g, '[$1,$2]'));
}

export function parseCase(raw) {
  const lines = raw.trim().split(/\r?\n/).filter(Boolean);
  if (lines.every((line) => line.trim().startsWith('[')) && lines.length === 2) return { operationArrays: lines.map(parseValue) };
  if (lines.length === 1 && lines[0].trim().startsWith('[')) return { flattenedOperations: parseValue(lines[0]) };
  const values = {};
  for (const line of lines) { const equal = line.indexOf('='); if (equal < 1) throw new Error(`Unsupported test input: ${line}`); values[line.slice(0, equal).trim()] = parseValue(line.slice(equal + 1)); }
  return { values };
}

function string(value) { return JSON.stringify(String(value)); }
function rune(value) {
  if (Number.isInteger(value)) return String(value);
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')}'`;
}
function literal(value, type, problem) {
  if (type === 'string') return string(value);
  // Numeric byte inputs (for example, a [][]byte island grid containing 0s
  // and 1s) should stay numeric. Character grids still use their byte value.
  if (type === 'byte') return Number.isInteger(value) ? String(value) : String(String(value).charCodeAt(0));
  if (type === 'rune') return rune(value);
  if (type === 'bool') return value ? 'true' : 'false';
  if (type === 'int') return String(value);
  if (type === 'float64' || type === 'float32') return Number.isInteger(value) ? `${value}.0` : String(value);
  if (type === '*ListNode') return `listFrom(${literal(value, '[]int', problem)})`;
  if (type === '*TreeNode') return `treeFrom(${literal(value, '[]any', problem)})`;
  if (type === '*Node' && problem?.id === 'copy-linked-list-with-random-pointer') return `randomListFrom(${literal(value, '[][]any', problem)})`;
  if (type.startsWith('[]')) return `${type}{${(value ?? []).map((item) => literal(item, type.slice(2), problem)).join(', ')}}`;
  if (type === 'any') return value === null ? 'nil' : Array.isArray(value) ? `[]any{${value.map((item) => literal(item, 'any', problem)).join(', ')}}` : Number.isInteger(value) ? String(value) : string(value);
  return String(value);
}

function parameters(source) {
  return source.split(',').map((item) => item.trim()).filter(Boolean).map((item) => {
    const [name, ...type] = item.split(/\s+/); return { name, type: type.join(' ') };
  });
}

function functionSignature(code) {
  const match = code.match(/func\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*([^\s{]+)?\s*\{/);
  if (!match) throw new Error('Could not find the starter function.');
  const params = parameters(match[2]);
  return { name: match[1], params, returns: match[3] ?? '' };
}

function emit(expression, type, problem) {
  if (type === '*ListNode') return `emitResult(listValue(${expression}))`;
  if (type === '*TreeNode') return `emitResult(treeValue(${expression}))`;
  if (type === '*Node' && problem?.id === 'copy-linked-list-with-random-pointer') return `emitResult(randomListValue(${expression}))`;
  if (type === '[][]byte') return `emitResult(byteGridValue(${expression}))`;
  return `emitResult(${expression})`;
}

function normalInvocation(problem, parsed) {
  const signature = functionSignature(problem.starterCode);
  const lines = [];
  for (const { name, type } of signature.params) {
    const value = parsed.values[name];
    lines.push(`  ${name} := ${literal(value, type, problem)}`);
  }
  const args = signature.params.map(({ name }) => name).join(', ');
  if (!signature.returns) return `${lines.join('\n')}\n  ${signature.name}(${args})\n  ${emit(signature.params[0]?.name ?? 'nil', signature.params[0]?.type, problem)}`;
  return `${lines.join('\n')}\n  ${emit(`${signature.name}(${args})`, signature.returns, problem)}`;
}

function operationInvocation(problem, parsed) {
  if (!parsed.operationArrays) throw new Error('Design tests must provide operation and argument arrays.');
  const [operations, argsList] = parsed.operationArrays;
  const type = problem.starterCode.match(/type\s+(\w+)\s+struct/)?.[1];
  if (!type) throw new Error('Could not find the design type.');
  const constructor = problem.starterCode.match(/func\s+Constructor\s*\(([^)]*)\)\s*([^\s{]+)\s*\{/);
  if (!constructor) throw new Error(`Could not find the ${type} constructor.`);
  const constructorParams = parameters(constructor[1]);
  const methods = [...problem.starterCode.matchAll(/func\s+\([^)]*\)\s*(\w+)\s*\(([^)]*)\)\s*([^\s{]+)?\s*\{/g)].map((match) => ({ name: match[1], params: parameters(match[2]), returns: match[3] ?? '' }));
  const methodFor = (operation) => methods.find((method) => method.name.toLowerCase() === String(operation).toLowerCase());
  const renderArgs = (params, values) => params.map(({ type: parameterType }, index) => literal(values?.[index], parameterType, problem)).join(', ');
  const lines = [`  solver := Constructor(${renderArgs(constructorParams, argsList[0] ?? [])})`, `  output := []any{nil}`];
  for (let index = 1; index < operations.length; index += 1) {
    const operation = operations[index];
    const method = methodFor(operation);
    if (!method) throw new Error(`Unsupported ${type} operation: ${operation}`);
    const rendered = renderArgs(method.params, argsList[index] ?? []);
    if (method.returns) lines.push(`  output = append(output, solver.${method.name}(${rendered}))`); else lines.push(`  solver.${method.name}(${rendered}); output = append(output, nil)`);
  }
  return `${lines.join('\n')}\n  emitResult(output)`;
}

export function buildProgram(problem, code, raw) {
  if (/^\s*(package|import)\b/m.test(code)) throw new Error('Write only the function(s) from the starter code. Package and imports are supplied for you.');
  const parsed = parseCase(raw);
  const body = parsed.operationArrays || parsed.flattenedOperations ? operationInvocation(problem, parsed) : normalInvocation(problem, parsed);
  const runtimeCode = rewriteRangeIntegerLoops(code)
    .replace(/\bmaps\s*\.\s*Equal\s*\(/g, 'mapsEqual(')
    .replace(/\bslices\s*\.\s*SortFunc\s*\(/g, 'goneet75SlicesSortFunc(')
    .replace(/\bslices\s*\.\s*Sort\s*\(/g, 'goneet75SlicesSort(')
    .replace(/\bslices\s*\.\s*Reverse\s*\(/g, 'goneet75SlicesReverse(')
    .replace(/\bcmp\s*\.\s*Compare\s*\(/g, 'goneet75CmpCompare(')
    .replace(/\bcmp\s*\.\s*Or\s*\(/g, 'goneet75CmpOr(');
  return `${preludeFor(problem, code)}\n${runtimeCode}\n\nfunc main() {\n  defer func() { if value := recover(); value != nil { fmt.Printf("${ERROR}%v\\n", value) } }()\n${body}\n}\n`;
}

export function readProgramOutput(output = '') {
  const stdout = [];
  let result; let error;
  for (const line of output.split(/\r?\n/)) {
    if (line.startsWith(RESULT)) {
      const payload = line.slice(RESULT.length);
      try { result = JSON.parse(payload); } catch { result = payload; }
    }
    else if (line.startsWith(ERROR)) error = line.slice(ERROR.length).trim();
    else if (line) stdout.push(line);
  }
  return { result, error, stdout };
}
