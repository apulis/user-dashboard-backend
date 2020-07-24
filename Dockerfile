FROM node:12


RUN mkdir -p /home/addon_custom_user_dasboard_backend
WORKDIR /home/addon_custom_user_dasboard_backend

ADD package.json .
ADD yarn.lock .

RUN yarn config set registry 'https://registry.npm.taobao.org'
RUN yarn

COPY . /home/addon_custom_user_dasboard_backend

RUN yarn build

EXPOSE 5001

CMD ["yarn", "start:prod"]