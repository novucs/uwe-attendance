#!/usr/bin/env bash

# Prerequisites
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install nodejs npm mongodb libusb-dev dh-autoreconf
sudo npm install -g @angular/cli
sudo systemctl start mongodb

# LibNFC
git clone https://github.com/nfc-tools/libnfc.git
cd libnfc
git checkout libnfc-1.7.1
git clean -d -f -x
git remote|grep -q anonscm||git remote add anonscm git://anonscm.debian.org/collab-maint/libnfc.git
git fetch anonscm
git checkout remotes/anonscm/master debian
git reset
dpkg-buildpackage -uc -us -b
sudo apt-get install libusb-0.1-4
sudo dpkg -i ../libnfc*.deb

# Public
cd ../public
npm install
ng build

# Scripts
cd ../scripts
npm install
tsc
npm start

# Server
cd ../server
npm install
tsc
npm start
