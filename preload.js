const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  // 可以在这里暴露一些系统级 API，比如打开本地文件夹
  openFolder: () => ipcRenderer.invoke('open-folder')
})
