# # Base image
# FROM node:slim
# # Creating a directory inside the base image and defining as the base directory
# WORKDIR /app
# # Copying the files of the root directory into the base directory
# ADD . /app
# # Installing the project dependencies
# RUN npm ci
# RUN npm install pm2@latest -g
# # Starting the pm2 process and keeping the docker container alive
# CMD pm2 start process.yml && tail -f /dev/null
# # Exposing the RestAPI port
# EXPOSE 3000

###############################
# BUILD FOR LOCAL DEVELOPMENT #
###############################

FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

USER node

########################
# BUILD FOR PRODUCTION #
########################

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

##############
# PRODUCTION #
##############

FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/ecosystem.config.js .

RUN npm install pm2@latest -g

EXPOSE 3000

CMD [ "pm2-runtime",  "ecosystem.config.js", "npm", "--", "start" ]