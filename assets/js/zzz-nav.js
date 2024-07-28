/**
 * 导航页面js
 */

if (!data || !data.data) {
    var data = { encrypt: null, data: [{ title: "默认分类" }] }
}

const vue = function(decryptData, pass) {
    const { createApp, ref, reactive, toRaw } = Vue
    const items = reactive(decryptData)
    const editModel = ref(false)
    const menu = ref(true)
    const editFlag = reactive({ info: false, child: false, btns: false })
    const editData = reactive({ title: '', href: '', icon: '', description: '', i: -1, j: -1, k: -1 })
    
    if (window.screen.width < 600) {
        menu.value = false
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
        editData.description = current.description
        editData.i = i
        editData.j = j
        editData.k = k
    }
    
    function getNewSite() {
        if (editFlag.info) {
            return { title: editData.title, href: editData.href, icon: editData.icon, description: editData.description }
        } else {
            return { title: editData.title }
        }
    }
    
    createApp({
        setup() {
            return {
                items,
                editModel,
                menu,
                editFlag,
                editData,
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
                        current.description = editData.description
                    }
                    document.querySelector('.marsk').style.display = 'none'
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
                },
                saveData: function() {
                    layer.prompt({
                        title: '使用当前密码加密保存', 
                        formType: 1,
                        btn: ['确定', '不加密', '取消'],
                        success: function() {
                            document.querySelector('.layui-layer-prompt .layui-layer-content .layui-layer-input').value = pass || ''
                        },
                        btn2: function(index, layero) {
                            saveRaw(toRaw(items))
                        }
                     }, 
                     function(password, index) {
                        if (password && password !== '') {
                            try {
                                data.data = encrypt(JSON.stringify(toRaw(items)), password)
                            } catch (error) {
                                console.log('encrypt error', error)
                                alert('encrypt error:' + error)
                                return
                            }
                            layer.close(index);
                            data.crypto = 'AES'
                            let saveContent = 'var data = ' + JSON.stringify(data, null, 4)
                            saveTxt(getFileName(), saveContent)
                        }
                    })
                }
            }
        },
        template: template
    }).mount('#app')
}

function saveRaw(rawItems) {
    delete data['crypto']
    data.data = rawItems
    let saveContent = 'var data = ' + JSON.stringify(data, null, 4)
    saveTxt(getFileName(), saveContent)
}

// 加密数据提示输入密码
const auth = function () {
    if (data.crypto) {
        layer.prompt({ 
            title: '请输入密码', 
            formType: 1,
            success: function(layero, index) {
                const input = document.querySelector('.layui-layer-prompt .layui-layer-content .layui-layer-input')
                input.addEventListener('keydown', function(e) {
                    if (e.keyCode === 13) {
                        handlePrompt(input.value, index)
                    }
                })
            }
        }, 
        function(password, index) {
            handlePrompt(password, index)
        })
    } else {
        vue(data.data)
    }
}

auth()

function handlePrompt(password, index) {
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
            vue(decryptData, password)
        }
    }
}
