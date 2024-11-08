# 阅读APP Web 服务 For kindle

## 使用方式 - 打包进 app 里

1. 下载解压 `release/html.zip`
2. 使用MT管理器，打开阅读app apk文件，找到`assets/web/vue/`,清空该目录，然后把第一步解压的`html/dist/`下的所有文件放到该目录下
3. 重新安装 apk 即可

## 本地启动访问

1. 前提：本项目运行与手机与kindle在同一个局域网下！！！
2. 运行 `npm i`
3. 运行 `npm run build`
4. 运行 `npm run preview`
5. kindle 访问命令行出现的地址即可

## 支持功能

- 书架
    - 输入服务地址，点击获取书架
- 阅读
    - 点击左右翻页，点击中间弹出菜单
    - 菜单中支持禁用上一页，点击左右都向下翻页
    - **仅支持文本阅读，不支持图片**
- 同步
    - 点击获取书架，同步手机最新阅读记录
    - kindle 上阅读时会同步记录到手机
    - 配置不会同步到手机，仅保存在 kindle 本地

## 字体修改

- 支持3种预设字体切换：思源宋体、方正楷体、方正准圆简体

## [变更记录][changelog]

[changelog]: CHANGELOG.md