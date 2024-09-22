let cache = undefined;

export default function getCache() { return cache; }
export function initCache(instrumentation) { cache = SimpleCache(instrumentation); return cache; }

function SimpleCache(instrumentation) {
  let filenames = undefined;
  const leaves = new Map();
  let promises = undefined;

  function loadCache() {
    if (promises) { return; }

    promises = new Map();

    for (const name of filenames) {
      promises.set(name, electron.loadFile(name).then(content => {
        leaves.set(name, content);
        promises.delete(name);
        if (instrumentation) {
          console.log("Cache: loaded", name);
        }
      }));
    }
  }

  return {
    filenames: async function() {
      if (!filenames) {
        filenames = await electron.loadFiles();
        if (instrumentation) {
          console.log("Cache: loaded file list", filenames);
        }
        loadCache(); // Don't await. Let them load in the background.
      }
      return filenames;
    },

    get: async function(name) {
      await loadCache();
      if (leaves.has(name)) { return leaves.get(name); }
      if (promises.has(name)) { 
        return await promises.get(name);
      }
      throw Error("Cache miss! Item not found: " + name);
    }
  };
}
