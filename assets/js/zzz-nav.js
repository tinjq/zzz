/**
 * 导航页面js
 */

// load data js txt file
let param = window.location.href.split("?")[1]
if (!param || !param.includes('=')) {
    param = 'nav'
} else {
    param = param.split("=")[1].split('#')[0]
}
let filename = decodeURI(param)
const script = document.createElement('script')
script.src = `datas/${filename}.txt`
script.onload = () => {
    loadDataSuccess(data)
    document.title = filename
}
script.onerror = (err) => {
    loadDataSuccess(null)
    document.title = filename
}
document.head.appendChild(script);


function loadDataSuccess(data) {
    if (!data || !data.data) {
        var data = { data: [{ title: "默认分类" }] }
    }
    if (!data.settings) {
        data.settings = { showEmptyCategory: true, crypto: false }
    }

    if (data.settings.crypto) {
        layer.prompt({
            title: '请输入密码',
            formType: 1,
            success: function (layero, index) {
                const input = document.querySelector('.layui-layer-prompt .layui-layer-content .layui-layer-input')
                input.addEventListener('keydown', function (e) {
                    if (e.keyCode === 13) {
                        let pass = input.value
                        handlePrompt(data, pass, index)
                    }
                })
            }
        }, function (password, index) {
            handlePrompt(data, password, index)
        })
    } else {
        vue(data)
    }
}

function handlePrompt(data, password, index) {
    if (password && password !== '') {
        let decryptData = null
        try {
            decryptData = JSON.parse(decrypt(data.data, password))
        } catch (error) {
            console.log('密码不正确')
            layer.msg('密码不正确')
        }
        if (decryptData) {
            layer.closeAll();
            vue(data, decryptData, password)
        }
    }
}

let editing = false
let settingsChanged = false
function vue(data, decryptData, password) {
    const { createApp, ref, reactive, toRaw } = Vue
    const items = reactive(decryptData || data.data)
    const settings = reactive(data.settings)
    const editFlag = reactive({ info: false, child: false, btns: false })
    const editData = reactive({ title: '', href: '', icon: '', remark:'', description: '', i: -1, j: -1, k: -1 })
    const controlData = reactive({
        editModel: false, showMenu: true, showSettings: false,
        showEmptyCategory: data.showEmptyCategory, crypto: data.crypto, password: password
    })

    if (window.screen.width < 600) {
        controlData.showMenu = false
    }

    function getCurrent(i, j, k) {
        if (!editFlag.info) {
            if (j === undefined) {
                return items[i]
            } else {
                return items[i].children[j]
            }
        } else if (editFlag.child) {
            if (j === undefined) {
                return items[i]
            } else {
                return items[i].children[j]
            }
        } else {
            if (j === undefined) {
                alert('j undefined')
            } else if (k === undefined) {
                return items[i].sites[j]
            } else {
                return items[i].children[j].sites[k]
            }
        }
    }

    function populateEditData(i, j, k) {
        let current = getCurrent(i, j, k)
        editData.title = current.title
        editData.href = current.href
        editData.icon = current.icon
        editData.remark = current.remark
        editData.description = current.description
        editData.i = i
        editData.j = j
        editData.k = k
    }

    function getNewSite() {
        if (editFlag.info) {
            return { title: editData.title, href: editData.href, icon: editData.icon, remark: editData.remark, description: editData.description }
        } else {
            return { title: editData.title }
        }
    }

    const app = createApp({
        setup() {
            return {
                items,
                editFlag,
                editData,
                controlData,
                settings,
                expand: function (e) {
                    const classList = e.currentTarget.parentNode.classList
                    const expended = classList.contains('expanded')
                    document.querySelectorAll('aside>ul>li.expanded').forEach(item => item.classList.remove('expanded'))
                    if (!expended) {
                        classList.add('expanded')
                    }
                },
                editSite: function (event, info, child, btns, i, j, k) {
                    editFlag.info = info
                    editFlag.child = child
                    editFlag.btns = btns
                    populateEditData(i, j, k)
                    document.querySelector('.marsk').style.display = 'block'
                    event.stopPropagation()
                },
                editUpdate: function () {
                    let current = getCurrent(editData.i, editData.j, editData.k)
                    current.title = editData.title
                    if (editFlag.info) {
                        current.href = editData.href
                        current.icon = editData.icon
                        current.remark = editData.remark
                        current.description = editData.description
                    }
                    document.querySelector('.marsk').style.display = 'none'
                    editing = true
                },
                editDelete: function (i, j, k) {
                    if (window.confirm('确定删除？')) {
                        if (j === undefined) {
                            alert('editDelete j undefined')
                        } else if (k === undefined) {
                            items[i].sites.splice(j, 1)
                        } else {
                            items[i].children[j].sites.splice(k, 1)
                        }
                        editing = true
                    }
                },
                insertBefore: function () {
                    let newSite = getNewSite()
                    if (editFlag.info) {
                        if (editData.j === undefined) {
                            alert("insertBefore j undefined")
                        } else if (editData.k === undefined) {
                            items[editData.i].sites.splice(editData.j, 0, newSite)
                        } else {
                            items[editData.i].children[editData.j].sites.splice(editData.k, 0, newSite)
                        }
                    } else {
                        if (editData.j === undefined) {
                            items.splice(editData.i, 0, newSite)
                        } else {
                            items[editData.i].children.splice(editData.j, 0, newSite)
                        }
                    }
                    document.querySelector('.marsk').style.display = 'none'
                    editing = true
                },
                insertAfter: function () {
                    let newSite = getNewSite()
                    if (editFlag.info) {
                        if (editData.j === undefined) {
                            alert("insertBefore j undefined")
                        } else if (editData.k === undefined) {
                            items[editData.i].sites.splice(editData.j + 1, 0, newSite)
                        } else {
                            items[editData.i].children[editData.j].sites.splice(editData.k + 1, 0, newSite)
                        }
                    } else {
                        if (editData.j === undefined) {
                            items.splice(editData.i + 1, 0, newSite)
                        } else {
                            items[editData.i].children.splice(editData.j + 1, 0, newSite)
                        }
                    }
                    document.querySelector('.marsk').style.display = 'none'
                    editing = true
                },
                deleteMenu: function (event, i, j) {
                    if (window.confirm('确定删除？')) {
                        if (j === undefined) {
                            if (items.length == 1) {
                                alert('至少有一个')
                            } else {
                                items.splice(i, 1)
                            }
                        } else {
                            items[i].children.splice(j, 1)
                        }
                        editing = true
                    }
                    event.stopPropagation()
                },
                appendChild: function () {
                    let newSite = getNewSite()
                    if (editFlag.info) {
                        if (editData.j === undefined) {
                            if (!items[editData.i].sites) {
                                items[editData.i].sites = []
                            }
                            items[editData.i].sites.push(newSite)
                        } else {
                            let children = items[editData.i].children[editData.j]
                            if (!children.sites) {
                                children.sites = []
                            }
                            children.sites.push(newSite)
                        }
                    } else {
                        if (editData.j === undefined) {
                            if (!items[editData.i].children) {
                                items[editData.i].children = []
                            }
                            items[editData.i].children.push(newSite)
                        }
                    }
                    document.querySelector('.marsk').style.display = 'none'
                    editing = true
                },
                saveData: function () {
                    if (settings.crypto && controlData.password && controlData.password.length > 0) {
                        try {
                            data.data = encrypt(JSON.stringify(toRaw(items)), controlData.password)
                        } catch (error) {
                            console.log('encrypt error', error)
                            alert('encrypt error:' + error)
                            return
                        }
                    } else {
                        data.data = toRaw(items)
                    }
                    save2Txt(data)
                },
                showSettingsForm() {
                    if (!settingsChanged) {
                        if (controlData.showEmptyCategory !== settings.showEmptyCategory) {
                            controlData.showEmptyCategory = settings.showEmptyCategory
                        }
                        if (controlData.crypto !== settings.crypto) {
                            controlData.crypto = settings.crypto
                        }
                        if (password !== controlData.password) {
                            controlData.password = password
                        }
                        if (settings.cardWidth !== controlData.cardWidth) {
                            controlData.cardWidth = settings.cardWidth
                        }
                    }
                    controlData.showSettings = true
                },
                confirmSettings() {
                    if (settings.showEmptyCategory !== controlData.showEmptyCategory) {
                        settings.showEmptyCategory = controlData.showEmptyCategory
                        settingsChanged = true
                    }
                    if (settings.crypto !== controlData.crypto) {
                        settings.crypto = controlData.crypto
                        settingsChanged = true
                    }
                    if (settings.crypto && password !== controlData.password) {
                        settingsChanged = true
                    }
                    if (settings.cardWidth !== controlData.cardWidth) {
                        settings.cardWidth = Number(controlData.cardWidth)
                        settingsChanged = true
                    }
                    controlData.showSettings = false
                },
                tooltipContent(site) {
                    return site.description ? site.description : site.remark ? site.remark : site.title
                }
            }
        }
    })

    app.use(ElementPlus)
    app.mount('#app')

    function save2Txt(data) {
        let saveContent = 'var data = ' + JSON.stringify(data, null, 4)
        saveTxt(filename, saveContent, () => {
            console.log('save file success')
            // layer.msg('保存成功')
            ElementPlus.ElMessage({ message: '保存成功', type: 'success', })
            editing = false
            settingsChanged = false
        }, (e) => {
            console.log('e name', e.name)
            if ("AbortError" !== e.name) {
                console.log('Use a link download')
                const blob = new Blob([saveContent], {type: "text/plain;charset=utf-8"});
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.rel = 'noopener'
                a.href = url
                a.download = filename
                a.click()
            }
        })
    }
}


window.addEventListener('beforeunload', (event) => {
    // Cancel the event as stated by the standard.
    if (editing || settingsChanged) {
        console.log('event.preventDefault')
        event.preventDefault();
    }
})