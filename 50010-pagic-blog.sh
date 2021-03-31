#!/bin/bash

if [ -n "$1" ];then
  cd $1
fi
pwd
echo "Start deployment"
echo "Pulling source code..."
git reset --hard origin/master
git clean -f
git pull
git checkout master
echo "Deploying source code..."
pagic build --serve --port 50011
echo "Finished."