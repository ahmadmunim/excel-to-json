const { ipcRenderer, contextBridge } = require("electron");

const api = {
    isExcel: async (path) => {
        return await ipcRenderer.invoke("is-excel", path);
    },
    getFilePath: (path) => ipcRenderer.send("excel-path", path),
    recieveJSON: (jsonData) => ipcRenderer.on("send-json", jsonData),
    sendFinal: (text) => ipcRenderer.send("text", text),
}

contextBridge.exposeInMainWorld("api", api);