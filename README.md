# 阅读APP Web 服务 For kindle

## 使用-方式一

1. 前提：本项目运行与手机与kindle在同一个局域网下！！！
2. 运行 `npm i`
3. 运行 `npm run build`
4. 运行 `npm run preview`
5. kindle 访问命令行出现的地址即可

## 使用-方式二

release/html.zip为最新发布，可直接部署该静态资源到自己的服务器或github pages等

## 支持功能

- 书架
    - 输入服务地址，点击获取书架
- 阅读
    - 点击左右翻页，点击中间弹出菜单。
    - **仅支持文本阅读，不支持图片**
- 同步
    - 点击获取书架，同步手机最新阅读记录
    - kindle 上阅读时会同步记录到手机
    - 配置不会同步到手机，仅保存在 kindle 本地

## 字体修改

- 字体文件在`public/fonts`下，默认提供的是思源黑体
- 字体加载在 `src/assets/styles/style.scss`27行，替换自己的字体后，将这里的字体文件名改成对应的即可


