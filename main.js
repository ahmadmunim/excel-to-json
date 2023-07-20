const { app, BrowserWindow, ipcMain} = require('electron');
const { dialog } = require('electron');
const {parse} = require('csv-parse')

const fs = require('fs')
const readXlsxFile = require('read-excel-file/node');
const path = require('path')

let window;

// opens gui
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

// checks if dropped file is .xlsx or .csv
ipcMain.handle("is-excel", async (_, path) => {
    return new Promise((resolve) => {
        resolve(path.substr(path.length - 3) === "csv" || path.substr(path.length - 4) === "xlsx");
    });
})

// converts entire csv/xlsx data to json
ipcMain.on('excel-path', (e, path) => {
    const isCSV = path.endsWith('.csv')
    if (isCSV) {
        var jsonRow = []
        var headers = []
        var i = 0
        fs.createReadStream(path)
            .pipe(parse())
            .on('data', (row) => { // iterates over entire csv file row by row
                if (i == 0) {
                    headers = row
                }
                else {
                    var temp = {};
                    for (var x = 0; x < row.length; x++) {
                        temp[headers[x]] = row[x]; // assigns key value pairs of json
                    }
                    jsonRow.push(temp)
                }
                i++;
            })
            .on('end', () => {
                e.sender.send('send-json', jsonRow)
            })
            .on('error', (err) => {
                console.error('Error reading CSV file: ', err)
                e.sender.send('send-json', { err: 'Error reading CSV file' }); 
            })
    }
    else {
        readXlsxFile(path).then((rows) => {
            var i = 0;
            var headers = []
            var jsonRow = []
            // iterates over entire xlsx file row by row
            rows.map((row) => {
                if (i == 0) {
                    headers = row
                }
                else {
                    var temp = {};
                    for (var x = 0; x < row.length; x++) {
                        temp[headers[x]] = row[x]; // assigns key value pairs of json
                    }
                    jsonRow.push(temp)
                }
                i++;
            })
            e.sender.send('send-json', jsonRow)
        }).catch((err) => {
            console.error('Error reading XLSX file:', err);
            e.sender.send('send-json', { err: 'Error reading XLSX file' }); 
        })   
    }
})

// saves json file
ipcMain.on('text', (_, text) => {
    dialog.showSaveDialog({
        title: 'Select the File Path to save',
        defaultPath: path.join(__dirname, '../sample.json'),
        buttonLabel: 'Save',
        // Restricting the user to only JSON Files.
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
              
            // Creating and Writing to the sample.json file
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