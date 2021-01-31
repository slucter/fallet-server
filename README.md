# Fallet Backend Restfull API

[![Release Version](https://img.shields.io/badge/release-v.1.0-blue)](https://github.com/slucter/fallet-server/releases/tag/1.0) [![Node JS](https://img.shields.io/badge/Dependencies-Express%20JS-green)](https://nodejs.org/en/)
![GitHub repo size](https://img.shields.io/github/repo-size/slucter/fallet-server)
![GitHub contributors](https://img.shields.io/github/contributors/slucter/fallet-server)
![GitHub stars](https://img.shields.io/github/stars/slucter/fallet-server?style=social)
![GitHub forks](https://img.shields.io/github/forks/slucter/fallet-server?style=social)

<p align="center">
  <a href="https://nodejs.org/">
    <img src="https://cdn-images-1.medium.com/max/871/1*d2zLEjERsrs1Rzk_95QU9A.png">
  </a>
</p>

## Table of Contents
- [Prerequiste](#prerequiste)
- [Instalation](#installation)
- [Contributing](#contributing)

## Prerequiste
- Node.js - Download and Install [Node.js](https://nodejs.org/en/).
- MySQL - Download and Install [MySQL](https://www.mysql.com/downloads/) - Make sure it's running on the default port.

## Installation
### Clone
```
$ https://github.com/slucter/fallet-server.git
$ cd fallet-server
$ npm install
```

### Create Environment Variable
```
$ mv .env.example .env
$ nano .env
```

```
SRV_PORT= // db port
DB_USERNAME= // db username
DB_PASS= / db password

BASE_URL= // http://host:port

JWT_KEY= // Jwt Key
URL_VUE_APP= // http://host:port

MAIL= // email for mailer
MAIL_PASS= // password mailer
```

### Start Development Server
```
$ npm run serve
```

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project
1. Create your Feature Branch  ```git checkout -b [feature]```
2. Commit your Changes ```git commit -m 'Add some feature'```
3. Push to the Branch ```git push origin [feature]```
4. Open a Pull Request
