const { ipcRenderer, contextBridge } = require("electron");

const api = {
    isXLSX: (path) => ipcRenderer.invoke("is-xlsx", path),
    getFilePath: (path) => ipcRenderer.send("excel-path", path),
    recieveJSON: (jsonData) => ipcRenderer.on("send-json", jsonData),
    sendFinal: (text) => ipcRenderer.send("text", text),
}

contextBridge.exposeInMainWorld("api", api);