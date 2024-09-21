async function doSomething() {
  const result = await electron.loadFiles();
  document.getElementById("target").textContent = JSON.stringify(result);
}

doSomething();
