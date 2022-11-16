
# Prostgles UI Electron

Build steps


```bash

git clone git@github.com:prostgles/ui-electron.git

cd ui-electron

npm i

git clone git@github.com:prostgles/ui.git

cd ui/server/

    ##Linux
    npm run build

    ##Windows
    npm run buildw

cd ../..

    ##Linux (Deb installer will be generated in: out/make/deb/x64/ )
    npm run make

    ##Windows
    npm run makew

    Install Inno Setup from: https://jrsoftware.org/isdl.php

    Compile using the config file:  packed/inno.iss
    Open script > Run (F9)

    Installation file will be generated in: packed/Output/

```
