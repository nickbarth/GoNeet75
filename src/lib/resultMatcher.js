function canonical(value) { return JSON.stringify(value); }
function sorted(values) { return [...values].sort((left, right) => canonical(left).localeCompare(canonical(right))); }

function parseAssignments(raw) {
  return Object.fromEntries(raw.split(/\r?\n/).map((line) => {
    const equal = line.indexOf('=');
    return [line.slice(0, equal), JSON.parse(line.slice(equal + 1))];
  }));
}

const UNORDERED_FLAT = new Set(['generate-parentheses', 'combinations-of-a-phone-number']);
const UNORDERED_OUTER = new Set(['permutations', 'palindrome-partitioning', 'n-queens']);
const UNORDERED_SETS = new Set(['subsets', 'combination-target-sum-ii', 'subsets-ii']);
const APPROXIMATE = new Set(['median-of-two-sorted-arrays', 'pow-x-n']);

function validCourseOrder(actual, raw, expected) {
  if (!Array.isArray(actual)) return false;
  if (!expected.length) return actual.length === 0;
  const { numCourses, prerequisites } = parseAssignments(raw);
  if (actual.length !== numCourses || new Set(actual).size !== numCourses) return false;
  const positions = new Map(actual.map((course, index) => [course, index]));
  if ([...positions.keys()].some((course) => !Number.isInteger(course) || course < 0 || course >= numCourses)) return false;
  return prerequisites.every(([course, prerequisite]) => positions.get(prerequisite) < positions.get(course));
}

function validClosestPoints(actual, raw) {
  const { points, k } = parseAssignments(raw);
  if (!Array.isArray(actual) || actual.length !== k) return false;
  const available = new Map();
  for (const point of points) available.set(canonical(point), (available.get(canonical(point)) ?? 0) + 1);
  for (const point of actual) {
    const key = canonical(point);
    if (!Array.isArray(point) || point.length !== 2 || !available.get(key)) return false;
    available.set(key, available.get(key) - 1);
  }
  const threshold = points.map(([x, y]) => x * x + y * y).sort((a, b) => a - b)[k - 1];
  return actual.every(([x, y]) => x * x + y * y <= threshold);
}

export function matches(problem, actual, expected, raw) {
  if (problem.id === 'course-schedule-ii') return validCourseOrder(actual, raw, expected);
  if (problem.id === 'k-closest-points-to-origin') return validClosestPoints(actual, raw);
  if (APPROXIMATE.has(problem.id)) {
    return typeof actual === 'number' && typeof expected === 'number'
      && Math.abs(actual - expected) <= 1e-9 * Math.max(1, Math.abs(expected));
  }
  const left = UNORDERED_FLAT.has(problem.id) || UNORDERED_OUTER.has(problem.id) ? sorted(actual)
    : UNORDERED_SETS.has(problem.id) ? sorted(actual.map((item) => sorted(item))) : actual;
  const right = UNORDERED_FLAT.has(problem.id) || UNORDERED_OUTER.has(problem.id) ? sorted(expected)
    : UNORDERED_SETS.has(problem.id) ? sorted(expected.map((item) => sorted(item))) : expected;
  return canonical(left) === canonical(right);
}
