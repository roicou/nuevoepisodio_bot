# Nuevo Episodio (Telegram Bot)

[![Telegram][telegram-image]][telegram-url] 

Bot de Telegram que notifica nuevos episodios de tus series favoritas

## Preparación previa

[![node version][node-image]][node-url]
[![NPM Version][npm-image]][npm-url]

### Servicios
- Base de datos en [MongoDB](https://www.mongodb.com/)
- API Key para la base de datos de series en [TMDB API](https://www.themoviedb.org/documentation/api?language=es)
- Bot Token en [Telegram](https://core.telegram.org/api)

### Dependencias npm
- [axios](https://www.npmjs.com/package/axios) (0.26.0)
- [moment](https://www.npmjs.com/package/moment) (2.29.1)
- [mongodb](https://www.npmjs.com/package/mongodb) (4.4.1)
- [node-cron](https://www.npmjs.com/package/node-cron) (3.0.0)
- [telegraf](https://www.npmjs.com/package/telegraf) (4.7.0)
```bash
$ npm install
```

### Fichero de configuración
En el directorio raíz debe exister el fichero `config.json` que contiene las credenciales de acceso a los servicios externos. Se puede copiar de su plantilla `config.json.dist`
```bash
$ cp config.json.dist config.json
```
Se deberá rellenar lo siguiente:

```diff
{
    "telegram": {
        "bot": "@nuevoepidosio_bot",
        "url": "https://t.me/nuevoepisodio_bot/",
+       "token": "<BOT-TOKEN-HERE>"
    },
    "mongodb": {
+       "uri":"<MONGODB-URI-HERE>",
        "options": {
            "connectTimeoutMS": 60000,
            "socketTimeoutMS": 600000,
            "useUnifiedTopology": true
        },
+       "db": "<MONGODB-DB-HERE>"
    },
    "tmdb": {
        "url": "https://api.themoviedb.org/3",
+       "api": "<TMDB-API-KEY-HERE>"
    }
}

```

## Estructura
```
./
├── 📁 commands
│   ├── 📁 commands
│   │   ├── 📄 borrar_serie.js
│   │   ├── 📄 detener.js
│   │   ├── 📄 nueva_serie.js
│   │   ├── 📄 proximos_estrenos.js
│   │   ├── 📄 series.js
│   │   └── 📄 start.js
│   └── 📄 commands.index.js
├── 📁 db
│   └── 📄 user.db.js
├── 📁 jobs
│   └── 📄 check_shows.js
├── 📁 libs
│   ├── 📄 mongodb.js
│   ├── 📄 prepare_shows.js
│   └── 📄 tmdb.js
├── 📁 services
│   └── 📄 user.service.js
├── 📄 .dockerignore
├── 📄 .gitignore
├── 📄 config.json.dist
├── 📄 Dockerfile
├── 🔑 LICENSE
├── 📄 main.js
├── 📄 package-lock.json
├── 📄 package.json
└── ℹ️ README.md
```

## Ejecución
```
$ node main.js
```


[npm-image]: https://img.shields.io/badge/npm-6.14.11-critical
[npm-url]: https://www.npmjs.com/
[node-image]: https://img.shields.io/badge/node-14.16.0-success
[node-url]: https://nodejs.org/en/
[typescript-image]: https://img.shields.io/badge/node-14.16.0-success
[typescript-url]: https://nodejs.org/en/
[telegram-image]: https://img.shields.io/badge/%40nuevoepisodio__bot-blue?logo=telegram
[telegram-url]: https://t.me/nuevoepisodio_bot
