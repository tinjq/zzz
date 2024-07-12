async function saveTxt(filename, saveContent) {
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

        console.log('save file success')
    } catch (error) {
        console.error('save file faild:', error)
        window.alert("save file faild:" + error)
    }
}

function encrypt(msg, key) {
    return CryptoJS.AES.encrypt(msg, key).toString()
}

function decrypt(msg, key) {
    return CryptoJS.AES.decrypt(msg, key).toString(CryptoJS.enc.Utf8)
}