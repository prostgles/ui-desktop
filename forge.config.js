module.exports = {
  packagerConfig: {
    icon: "icon512.png",
  },
  electronPackagerConfig: {
    icon: "icon512.png",
  },
  rebuildConfig: {},
  makers: [
    {
      "name": "@electron-forge/maker-dmg",
      "config": {
        icon: 'icon512.png',
        "icon": "icon512.png"
      }
    },
    {
      "name": "@electron-forge/maker-squirrel",
      "config": {
        icon: "icon512.png",
        "authors": "ProstglesUI",
        "iconUrl": "https://prostgles.com/favicon.ico",
        "name": "ProstglesUI"
      }
    },
    {
      "name": "@electron-forge/maker-deb",
      "config": {
        "options": {
          icon: "icon512.png",
          "maintainer": "prostgles",
          "homepage": "https://prostgles.com/favicon.ico"
        }
      }
    }
  ]
};
