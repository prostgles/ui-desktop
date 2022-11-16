
# Prostgles UI Electron

Build steps


```bash

git clone git@github.com:prostgles/ui-electron.git

cd ui-electron

npm i

git clone git@github.com:prostgles/ui.git

cd ui/server/

npm run build

cd ../..

    ##Linux (Deb installer will be generated in out/make/deb/x64/ )
    npm run make

##Windows
npm run pack
mv .\prostgles-desktop-win32-x64\locales\  .\prostgles-desktop-win32-x64\Data\
mv .\prostgles-desktop-win32-x64\resources\  .\prostgles-desktop-win32-x64\Data\

Install Inno Setup from https://jrsoftware.org/isdl.php


```
