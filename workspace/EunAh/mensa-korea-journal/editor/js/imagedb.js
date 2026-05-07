// 이미지 원본 데이터 전용 저장소 (IndexedDB)
// 아티클 메타데이터는 localStorage(state.js), 이미지 바이너리는 여기서 관리

const IDB_NAME    = 'mensa_images_v1';
const IDB_VERSION = 1;
const IDB_STORE   = 'images';

function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess  = e => resolve(e.target.result);
    req.onerror    = e => reject(e.target.error);
  });
}

async function idbSave(id, dataUrl) {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put({ id, dataUrl });
    tx.oncomplete = resolve;
    tx.onerror    = e => reject(e.target.error);
  });
}

async function idbGet(id) {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(IDB_STORE, 'readonly');
    const req = tx.objectStore(IDB_STORE).get(id);
    req.onsuccess = e => resolve(e.target.result?.dataUrl || null);
    req.onerror   = e => reject(e.target.error);
  });
}

async function idbDelete(id) {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).delete(id);
    tx.oncomplete = resolve;
    tx.onerror    = e => reject(e.target.error);
  });
}

async function idbGetAll(ids) {
  const db = await openIDB();
  const results = {};
  await Promise.all(ids.map(id => new Promise((resolve, reject) => {
    const tx  = db.transaction(IDB_STORE, 'readonly');
    const req = tx.objectStore(IDB_STORE).get(id);
    req.onsuccess = e => { results[id] = e.target.result?.dataUrl || null; resolve(); };
    req.onerror   = e => reject(e.target.error);
  })));
  return results;
}
