const { app, BrowserWindow, ipcMain, electron } = require('electron');
const { dialog } = require('electron');
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
        e.sender.send('send-json', jsonRow)
    })   
})

ipcMain.on('text', (_, text) => {
    dialog.showSaveDialog({
        title: 'Select the File Path to save',
        defaultPath: path.join(__dirname, '../sample.json'),
        // defaultPath: path.join(__dirname, '../assets/'),
        buttonLabel: 'Save',
        // Restricting the user to only Text Files.
        filters: [
            {
                name: 'json',
                extensions: ['json']
            }, ],
        properties: []
    }).then(file => {
        // Stating whether dialog operation was cancelled or not.
        console.log(file.canceled);
        if (!file.canceled) {
            console.log(file.filePath.toString());
              
            // Creating and Writing to the sample.txt file
            fs.writeFile(file.filePath.toString(), 
                         text, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        }
    }).catch(err => {
        console.log(err)
    });
})
