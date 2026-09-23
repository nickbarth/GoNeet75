const LEGACY_DB_NAME = 'blind75-go-practice';
const DB_NAME = 'goneet75-go-practice';
const STORE_NAME = 'practice-state';
const STATE_KEY = 'current';

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function deleteLegacyDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(LEGACY_DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error('Could not delete the old Blind 75 practice database.'));
    request.onblocked = () => reject(new Error('Close any open tabs for the old Blind 75 app, then reload GoNeet75 so its saved state can be removed.'));
  });
}

async function transact(mode, callback) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = callback(store);
    transaction.oncomplete = () => { db.close(); resolve(request?.result); };
    transaction.onerror = () => { db.close(); reject(transaction.error); };
  });
}

export async function loadState() {
  await deleteLegacyDatabase();
  const state = await transact('readonly', (store) => store.get(STATE_KEY));
  return state ?? { codeByProblemId: {}, completedProblemIds: [] };
}

export async function saveState(state) {
  await transact('readwrite', (store) => store.put(state, STATE_KEY));
}

export async function clearState() {
  await transact('readwrite', (store) => store.delete(STATE_KEY));
}
