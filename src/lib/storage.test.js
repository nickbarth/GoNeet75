import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import { clearState, loadState, saveState } from './storage.js';

const LEGACY_DB_NAME = 'blind75-go-practice';
const DB_NAME = 'goneet75-go-practice';

function deleteDatabase(name) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(name);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error(`Database ${name} is blocked`));
  });
}

function openLegacyDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(LEGACY_DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('practice-state');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

beforeEach(async () => {
  await deleteDatabase(LEGACY_DB_NAME);
  await deleteDatabase(DB_NAME);
});

describe('practice state storage', () => {
  it('deletes the legacy database before returning an empty state', async () => {
    const legacy = await openLegacyDatabase();
    legacy.close();

    await expect(loadState()).resolves.toEqual({
      codeByProblemId: {},
      completedProblemIds: [],
    });

    const databases = await indexedDB.databases();
    expect(databases.map(({ name }) => name)).not.toContain(LEGACY_DB_NAME);
    expect(databases.map(({ name }) => name)).toContain(DB_NAME);
  });

  it('saves, loads, and clears GoNeet75 progress', async () => {
    const state = {
      codeByProblemId: { 'valid-sudoku': 'func isValidSudoku() bool { return true }' },
      completedProblemIds: ['valid-sudoku'],
    };

    await saveState(state);
    await expect(loadState()).resolves.toEqual(state);
    await clearState();
    await expect(loadState()).resolves.toEqual({
      codeByProblemId: {},
      completedProblemIds: [],
    });
  });

  it('reports when an old tab blocks legacy cleanup', async () => {
    const legacy = await openLegacyDatabase();
    await expect(loadState()).rejects.toThrow('Close any open tabs for the old Blind 75 app');
    legacy.close();
  });
});
