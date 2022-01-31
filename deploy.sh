#!/usr/bin/env sh

set -e
git add .
git commit -m 'push'
git push -f https://github.com/lemononmars/thwordsearch.git main

npm run build
cd dist

git add -A
git commit -m 'deploy'

git push -f https://github.com/lemononmars/thwordsearch.git master

cd -