# 1. 部署本地数据库

### 1.1 克隆文件到本地

```
https://github.com/danbaixi/UAAS-API
```

### 1.2 进入文件根目录打开cmd运行本地数据库

```
npm start
```



# 2. 登录

**测试号：test  密码：123456**

**UI设计稿地址：https://github.com/danbaixi/yunxiaohui**

### 2.1 引入coloruicss

> 1. 将项目拷贝下来，拷贝地址：https://github.com/weilanwl/coloruicss
> 2. 将coloruicss->template->colorui拷贝到自己的项目style目录中
> 3. 在style中新建main.wxss作为基础样式文件，引入colorui中的三个文件，分别是main.wxss   icon.wxss  animation.wxss
> 4. 在根目录的app.wxss中引入刚刚创建的main.wxss

**可能会报错，如果报错就清除缓存重新编译**

### 2.2 使用colorui

>1. 导入项目coloruicss->demo
>2. 选择测试号
>3. 运行项目