FROM ghcr.io/puppeteer/puppeteer:24.16.0 
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true\
PUPPETEER_EXECUTABLE_PATH = /usr/bin/google-chrome-stable
WORKDIR /usr/src/app
COPY package*.jason ./
RUN npm ci
COPY . .
CMD ['node' , "src/app.js"]