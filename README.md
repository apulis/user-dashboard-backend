
# 用户权限管理组件服务端

## 部署方式

### 1. 环境变量配置

在项目根目录下，需要有一个生成一个名称为 develop.env 的文件，里面记录了项目相关的配置信息
文件内容示例如下：

```

# Log
LOGGING_DIR=logs
LOGGING_LEVEL=debug

# Auth
JWT_SECRET_KEY=Sign key for JWT
SECRET_KEY=Sign key for Password

# OAuth
MS_CLIENT_ID=6d93837b-d8ce-48b9-868a-39a9d843dc57
MS_CLIENT_SECRET=eIHVKiG2TlYa387tssMSj?E?qVGvJi[]

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

ADMINISTRATOR_USER_NAME="["xianjie.han", "ADMIN"]"
ADMINISTRATOR_PASSWORD=123456
```

部分配置项说明：
JWT_SECRET_KEY： JWT 的签名 key
SECRET_KEY：加密用户密码的盐
ADMINISTRATOR_USER_NAME:  admin 权限的用户信息，是 Array 的格式


### 2. 编译

设置淘宝源

```
yarn config set registry 'https://registry.npm.taobao.org'
```

安装依赖

```
yarn
```

编译

```
yarn build
```



### 3. 运行项目命令

- 启动 redis
如果本地安装了 docker，可以运行
```
docker run -p9301:6379 redis
```
在 9301 端口运行 redis


- 启动项目
```
yarn start:prod
```



### 4. 初始化数据库 Table 和数据

项目使用的 typeorm 会自动初始化数据库

