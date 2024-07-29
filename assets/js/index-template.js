let template = `
  <aside v-if="menu">
      <ul>
          <li v-for="(item, i) in items" :key="item.title">
              <a :href="'#' + item.title + i" @click="expand($event)">
                  <i v-if="editModel" class="iconfont icon-delete hover-enlarge" @click="deleteMenu($event,i)"></i>
                  <i v-if="editModel" class="iconfont icon-edit hover-enlarge" @click="editSite($event, false, true, true, i)"></i>
                  <i v-if="!editModel" class="iconfont icon-tag"></i>
                  <span class="title nowrap-ellipsis">{{item.title}}</span>
                  <i v-if="item.children && item.children.length > 0" class="iconfont icon-right"></i>
              </a>
              <ul v-if="item.children && item.children.length > 0">
                  <li v-for="(child, j) in item.children" :key="child.title">
                      <a :href="'#' + child.title + i + j">
                          <i v-if="editModel" class="iconfont icon-delete hover-enlarge" @click="deleteMenu($event,i,j)"></i>
                          <i v-if="editModel" class="iconfont icon-edit hover-enlarge" @click="editSite($event, false, false, true, i,j)"></i>
                          <span class="title nowrap-ellipsis">{{child.title}}</span>
                      </a>
                  </li>
              </ul>
          </li>
      </ul>
  </aside>

  <nav :class="menu ? 'menu' : 'no-menu'">
      <a @click="menu = !menu" class="left">
          <i class="iconfont icon-category hover-enlarge"></i>
      </a>
      <a href="javascript:;" class="center">
      </a>
      <a href="https://github.com/tinjq/zzz" target="_blank">
          <i class="iconfont icon-github hover-enlarge"></i>
      </a>
  </nav>
  
  <main :class="menu ? 'menu' : 'no-menu'">
      <div id="content">
          <div v-for="(item, i) in items" :key="item.title">
              <h4 :id="item.title + i">{{item.title}}
                  <i  v-if="editModel" class="iconfont icon-add hover-enlarge" @click="editSite($event, true, true, false, i)"></i>
              </h4>
              <div v-if="item.sites && item.sites.length > 0" class="site-cards">
                  <div v-for="(site, j) in item.sites" :key="site.child">
                      <div class="site-card" :data-tippy-content="site.description ? site.description : site.title" data-tippy-placement="bottom">
                          <a :href="site.href" target="_blank">
                              <p class="nowrap-ellipsis"><strong>{{site.title}}</strong></p>
                              <p class="nowrap-ellipsis">{{site.description}}</p>
                          </a>
                          <div v-if="editModel" class="edit-icons">
                              <i class="iconfont icon-edit hover-enlarge" @click="editSite($event, true, false, true, i, j)"></i>
                              <i class="iconfont icon-delete hover-enlarge" @click="editDelete(i, j)"></i>
                          </div>
                      </div>
                  </div>
              </div>

              <div v-if="item.children && item.children.length > 0" v-for="(child, j) in item.children" :key="child.title">
                  <h4 :id="child.title + i + j">{{child.title}}
                      <i  v-if="editModel" class="iconfont icon-add hover-enlarge" @click="editSite($event, true, true, false, i, j)"></i>
                  </h4>
                  <div class="site-cards">
                      <div v-for="(site, k) in child.sites" :key="site.title">
                          <div class="site-card" :data-tippy-content="site.description ? site.description : site.title" data-tippy-placement="bottom">
                              <a :href="site.href" target="_blank">
                                  <p class="nowrap-ellipsis"><strong>{{site.title}}</strong></p>
                                  <p class="nowrap-ellipsis">{{site.description}}</p>
                              </a>
                              <div v-if="editModel" class="edit-icons">
                                  <i class="iconfont icon-edit hover-enlarge" @click="editSite($event, true, false, true, i, j, k)"></i>
                                  <i class="iconfont icon-delete hover-enlarge" @click="editDelete(i, j, k)"></i>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

          </div>
      </div>

      <div class="footer-tools flex-column">
          <a v-show="editModel" class="rounded-circle" @click="saveData" data-tippy-content="修改后要保存，否则刷新页面就丢了" data-tippy-placement="left">
              <i class="iconfont icon-save hover-enlarge"></i>
          </a>
          <a class="rounded-circle" @click="editModel = !editModel" data-tippy-content="切换修改模式" data-tippy-placement="left">
              <i class="iconfont icon-edit hover-enlarge"></i>
          </a>
          <a href="javascript:window.scrollTo({ top: 0 });" class="rounded-circle" data-tippy-content="回到顶部" data-tippy-placement="left">
              <i class="iconfont icon-to-up hover-enlarge"></i>
          </a>
      </div>

      <div class="marsk" onclick="this.style.display = 'none'">
          <div class="popup" onclick="event.stopPropagation()">
              <div>标题：<input type="text" v-model="editData.title"></div>
              <div v-if="editFlag.info">链接：<input type="text" v-model="editData.href"></div>
              <div v-if="editFlag.info">图片：<input type="text" v-model="editData.icon"></div>
              <div v-if="editFlag.info">描述：<input type="text" v-model="editData.description"></div>
              <div class="btns">
                  <button v-if="editFlag.btns" @click="editUpdate">修改</button>
                  <button v-if="editFlag.btns" @click="insertBefore">前面插入</button>
                  <button v-if="editFlag.btns" @click="insertAfter">后面插入</button>
                  <button v-if="editFlag.child" @click="appendChild">添加子项</button>
              </div>
          </div>
      </div>
  </main>
`