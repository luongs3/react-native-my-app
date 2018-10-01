#!/bin/bash
cd ./node_modules/viblo-sdk/
npm install --save-dev typescript@2.6.2
npm install --save-dev @types/node
npm run compile
cp -R dist/* .
cd ../..