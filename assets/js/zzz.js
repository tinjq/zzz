function getFileName() {
    let fileName = document.querySelector('#data-js').src
    return fileName.replace(/(.*\/)*([^.]+).*/ig,"$2");
}

async function saveTxt(filename, saveContent, successCallback, errorCallback) {
    try {
        const opts = {
            types: [
                {
                    accept: { "text/plain": [".txt"] }
                }
            ],
            suggestedName: filename
        }

        const handle = await window.showSaveFilePicker(opts);
        const writable = await handle.createWritable();

        await writable.write(saveContent)
        await writable.close()

        if (!successCallback) {
            saveSuccess()
        }
    } catch (error) {
        if (!errorCallback) {
            saveError(error)
        }
    }
}

function saveSuccess() {
    console.log('save file success')
}

function saveError(error) {
    console.error('save file faild:', error)
    window.alert("save file faild:" + error)
}

function encrypt(msg, key) {
    return CryptoJS.AES.encrypt(msg, key).toString()
}

function decrypt(msg, key) {
    return CryptoJS.AES.decrypt(msg, key).toString(CryptoJS.enc.Utf8)
}