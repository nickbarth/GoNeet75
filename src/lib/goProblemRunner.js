import { workerSource } from '../generated/goRuntimeWorker.js';
import { getThreeTestCases } from '../data/testCases.js';
import { buildProgram, readProgramOutput } from './goProgram.js';

const TIMEOUT_MS = 5_000;
let workerUrl;

function createWorker() {
  if (!workerUrl) workerUrl = URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' }));
  return new Worker(workerUrl, { name: 'goneet75-go-runtime' });
}

function useRuntime(message) {
  return new Promise((resolve) => {
    const worker = createWorker();
    const timeout = window.setTimeout(() => { worker.terminate(); resolve({ error: `Timed out after ${TIMEOUT_MS / 1000} seconds.` }); }, TIMEOUT_MS);
    worker.onmessage = ({ data }) => { window.clearTimeout(timeout); worker.terminate(); resolve(data.ok ? { results: data.results, result: data.result } : { error: data.error }); };
    worker.onerror = (event) => { window.clearTimeout(timeout); worker.terminate(); resolve({ error: event.message || 'The Go test worker stopped before returning a result.' }); };
    worker.postMessage(message);
  });
}

function runSources(sources) { return useRuntime({ sources }); }

export async function formatGoCode(source) {
  const response = await useRuntime({ action: 'format', source });
  if (response.error) throw new Error(response.error);
  const result = response.results ?? response.result;
  if (result?.error) throw new Error(result.error);
  return result?.source ?? source;
}

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

export async function runProblem(problem, code) {
  const raws = getThreeTestCases(problem);
  let userSources; let referenceSources;
  try { userSources = raws.map((raw) => buildProgram(problem, code, raw)); referenceSources = raws.map((raw) => buildProgram(problem, problem.referenceCode, raw)); }
  catch (error) { return raws.map((raw) => ({ raw, passed: false, error: error instanceof Error ? error.message : String(error), logs: [] })); }
  const response = await runSources([...referenceSources, ...userSources]);
  if (response.error) return raws.map((raw) => ({ raw, passed: false, error: response.error, logs: [] }));
  return raws.map((raw, index) => {
    const expectedRun = readProgramOutput(response.results[index]?.stdout);
    const actualRun = readProgramOutput(response.results[index + raws.length]?.stdout);
    const error = expectedRun.error || actualRun.error || response.results[index]?.error || response.results[index + raws.length]?.error || response.results[index]?.stderr || response.results[index + raws.length]?.stderr;
    return error ? { raw, passed: false, error, logs: actualRun.stdout } : { raw, expected: expectedRun.result, actual: actualRun.result, passed: matches(problem, actualRun.result, expectedRun.result, raw), logs: actualRun.stdout };
  });
}
