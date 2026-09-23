import { workerSource } from '../generated/goRuntimeWorker.js';
import { getThreeTestCases } from '../data/testCases.js';
import { buildProgram, readProgramOutput } from './goProgram.js';
import { matches } from './resultMatcher.js';

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
