const { app, BrowserWindow, ipcMain, electron } = require('electron');
const { lstatSync } = require('fs');

const fs = require('fs')
const readXlsxFile = require('read-excel-file/node');
const url = require('url')
const path = require('path')

let window;

app.on('ready', () => {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: __dirname + "/preload.js"
        }
    });

    window.loadFile('views/index.html');
})

ipcMain.handle("is-xlsx", async (_, path) => {
    return path.substr(path.length - 4) == 'xlsx'
})

ipcMain.on('excel-path', (e, path) => {
    readXlsxFile(path).then((rows) => {
        var i = 0;
        var headers = []
        var jsonRow = []
        
        rows.map((row, index) => {
            if (i == 0) {
                headers = row
            }
            else {
                var temp = {};
                for (var x = 0; x < row.length; x++) {
                    temp[headers[x]] = row[x];
                }
                jsonRow.push(temp)
            }
            i++;
        })

        // fs.writeFile('data.json', JSON.stringify(jsonRow), (err) => {
        //     if (err)
        //         throw err
        // })
        e.sender.send('send-json', jsonRow)
    })   
})

function excelToJSON(path) {

}