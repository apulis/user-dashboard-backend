
# 用户权限管理组件服务端

## 部署方式

### 1. 环境变量配置

在项目根目录下，需要有一个生成一个名称为 production.env 的文件，里面记录了项目相关的配置信息
文件内容示例如下：

```
# Log
LOGGING_DIR=logs
LOGGING_LEVEL=debug

# Auth
JWT_SECRET_KEY=4C31F7EFD6857D91E729165510520424
SECRET_KEY='WJiol_8776#'

# OAuth
MS_CLIENT_ID=6d93837b-d8ce-48b9-868a-39a9d843dc57
MD_CLIENT_SECRET=eIHVKiG2TlYa387tssMSj?E?qVGvJi[]

WX_APP_ID=wx403e175ad2bf1d2d
WX_SECRET=dc8cb2946b1d8fe6256d49d63cd776d0

# Server
APP_HOST=localhost
APP_PORT=5001

# Database
DB_HOST=localhost
DB_TYPE=mysql
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=123456
DB_NAME=user_group

FIRST_USER="{"userName":"xianjie.han","password":"123456"}"
FIRST_USER_ROLE="{"userId":1,"roleId":1}"
```

### 2. 编译

依次运行以下命令
```
yarn
yarn build 
```

### 3. 运行项目命令

```
yarn start:prod
```



### 4. 初始化数据库

1. 数据库内的表结构，一部分初始角色，权限会在应用程序内初始化好
2. 在部署时需要初始化第一个身份为管理员的用户，以及 