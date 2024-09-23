import { initCache } from "../auxiliary/cache";

initCache(electron, true);

export function openTab(id) {
  [...document.getElementsByClassName("tab")].forEach(tab => tab.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}
