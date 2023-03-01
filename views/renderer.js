const dropZone = document.getElementById("drop-zone")
const jsonButton = document.getElementById('save-json')

dropZone.addEventListener("dragover", (e) => {
    e.stopPropagation();
    e.preventDefault();
})

dropZone.addEventListener("drop", async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    const isFile = await window.api.isXLSX(file.path);
    console.log(isFile)
    window.api.getFilePath(file.path)
    
})

window.api.recieveJSON((e, jsonRow) => {
    document.getElementById('text-area').innerHTML = JSON.stringify(jsonRow, null, '\t')
})

jsonButton.addEventListener("click", (e) => {
    let txtArea = document.getElementById('text-area').innerHTML
    window.api.sendFinal(txtArea)
})

