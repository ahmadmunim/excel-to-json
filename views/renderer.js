const dropZone = document.getElementById("drop-zone")
const saveJsonButton = document.getElementById('save-json')

dropZone.addEventListener("dragover", (e) => {
    e.stopPropagation();
    e.preventDefault();
})

//handles dropdown event
dropZone.addEventListener("drop", async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    try {
        await window.api.isExcel(file.path);
        await window.api.getFilePath(file.path);
      } catch (error) {
        console.log('error');
    }
    
})

// writes converted json data into text area
window.api.recieveJSON((e, jsonRow) => {
    const textArea = document.getElementById('text-area')
    textArea.value = JSON.stringify(jsonRow, null, '\t')
})

// saves json file onto machine
saveJsonButton.addEventListener("click", (e) => {
    let txtArea = document.getElementById('text-area').innerHTML
    window.api.sendFinal(txtArea)
})

