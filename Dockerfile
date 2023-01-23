FROM node

WORKDIR /usr/app

COPY package.json ./

COPY . .

RUN npm install yarn

RUN yarn install


EXPOSE 3333

CMD ["yarn", "dev"]