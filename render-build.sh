#!/usr/bin/env bash
#exit on error

set -o errexit

#Install dependencies

npm install

# Uncomment this line if you need to build your project

#npm run build

 #Ensure the Puppeteer cache directory exists

PUPPETEER_CACHE_DIR=C:\Users\dilsh\.cache\puppeteer\chrome\win64-139.0.7258.66\chrome-win64\chrome.exe

mkdir -p $PUPPETEER_CACHE_DIR

#Install Puppeteer and download Chrome

npx puppeteer browsers install chrome

#Store/pull Puppeteer cache with build cache

if [[ ! -d $PUPPETEER_CACHE_DIR ]]; then

echo "...Copying Puppeteer Cache from Build Cache"

#Copying from the actual path where Puppeteer stores its Chrome binary

cp -R C:\Users\dilsh\.cache\puppeteer\chrome\win64-139.0.7258.66\chrome-win64\chrome.exe $PUPPETEER_CACHE_DIR

else
echo "...Storing Puppeteer Cache in Build Cache"
cp -R $PUPPETEER_CACHE_DIR C:\Users\dilsh\.cache\puppeteer\chrome\win64-139.0.7258.66\chrome-win64\chrome.exe
fi 


