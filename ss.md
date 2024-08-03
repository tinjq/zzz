### 待完善：
- [x] tooltip 功能不支持 vue

- [x] 菜单名以 "?#"、“#” 开头有没有问题

- [ ] 保存成功的tip从右边弹出，类似于系统通知

- [x] 公用 index.html 页面，加载不同的 data 数据
    - js 动态加载 data.js 文件
    - data.js 文件名或路径通过参数传给 index.html?data=aaa 页面

- [ ] Settings 功能
    - [x] 是否显示空分类
    - [x] 是否加密
    - [x] 加密密码
    - [x] 卡片大小
    - 字体大小（菜单宽度）,页面统一使用自适应字体单位

- [x] 选择保存路径，取消时的错误提示优化

- [ ] 移动端 touch 


### 优化、注意点：

- 刷新页面提示功能：使用 vue 的监听功能对 data 数据的变化做监听

- (低优先级) v-for 的 :key 值设计（数据 id 的设计）
    - 原数据：页面加载时获取 timestamp = Date.now(), 每个列表 :key = timestamp - index
    - 新添加数据：Date.now()