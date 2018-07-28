# website-react

[![Build Status](https://travis-ci.org/ResistanceCN/website-react.svg?branch=master)](https://travis-ci.org/ResistanceCN/website-react)

## Build

Install `nodejs`(>= 6) and `yarn`.
Copy the `.env.example` to `.env` and edit it.

```shell
$ # git clone and cd
$ yarn install
$ yarn build
$ yarn start # default http://localhost:3000
```

## Todo List

- [ ] 完善用戶管理，連接到 API
- [ ] 表单管理
- [ ] 管理员可预览源文章(raw)
- [ ] 考虑替换地图服务
- [ ] 个人设置页面（包含 Bio 信息编辑，帐号删除，帐号绑定迁移）
- [ ] （可选）disqus 评论系统（需注册填表之后才开放）
- [x] [Bug] 修复 lambda in render
- [x] 检测填表状态
- [x] 压缩 404 图片
- [x] 控制台添加文章链接
- [x] 將管理員控制台面板从 userMenu 獨立出來到 panel
- [x] 更改文章編輯器發佈控件位置，以及增添取消編輯，并取消 footer
- [x] 公式块过长 （添加行内横向滚动或固定宽度，编辑器预览页面添加示宽线）

## Design

### Primary Color

RGB：#3f62ff

> [What is Ant Color style?](https://github.com/ant-design/ant-design/blob/734beb84ffc3f0469fbae1566aa8450f966cb261/components/style/color/colorPalette.less)

### Screenshots

- Home Page:
  ![img](design/screenshots/home.png)
- Login:
  ![img](design/screenshots/login.png)
- Article:
  ![img](design/screenshots/article.png)
- Editor:
  ![img](design/screenshots/editor.png)
- Prifile:
  ![img](design/screenshots/profile.png)
- 404 Page:
  ![img](design/screenshots/404.png)
- Control panel:
  ![img](design/screenshots/admin.png)
