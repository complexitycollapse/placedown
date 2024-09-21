import { ipcMain } from "electron";
import { promises } from "fs";
import path from 'path';

ipcMain.handle("loadFiles", (event, command) => {
  return promises.readdir("objects");
});
