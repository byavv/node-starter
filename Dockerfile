FROM node:7.4

# Maintainer
MAINTAINER Aksenchyk V. <aksenchyk.v@gmail.com>

# Define app directory
WORKDIR /usr/app

# Create app directory
RUN mkdir -p /usr/app

# Copy app sources
COPY . /usr/app

# Install dependencies and build client
RUN npm install
  
# Make server available
EXPOSE 3005

CMD [ "npm", "start"]