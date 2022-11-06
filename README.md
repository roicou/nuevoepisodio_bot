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
- [axios](https://www.npmjs.com/package/axios) v1.1.3
- [dotenv](https://www.npmjs.com/package/dotenv) v16.0.3
- [lodash](https://www.npmjs.com/package/lodash) v4.17.21
- [luxon](https://www.npmjs.com/package/luxon) v3.0.4
- [mongoose](https://www.npmjs.com/package/mongoose) v6.7.0
- [telegraf](https://www.npmjs.com/package/telegraf) v4.10.0
- [winston](https://www.npmjs.com/package/winston) v3.8.2
- [winston-daily-rotate-file](https://www.npmjs.com/package/winston-daily-rotate-file) v4.7.1

```bash
$ npm install
```
### Pasos previos
Algunas fotos de portada dan error al ser enviadas a través de Telegram, por lo que es necesario crear un grupo (privado) donde el bot intentará enviar las imágnes previamente para saber si puede enviar la imagen en el grupo o no llamado en la configuración `TELEGRAM_TEST_GROUP_ID`

También se contempla el uso de un bot de test
### Fichero de configuración
En el directorio raíz debe exister el fichero `config.json` que contiene las credenciales de acceso a los servicios externos. Se puede copiar de su plantilla `config.json.dist`
```bash
$ cp .env.sample .env
```
Se deberá rellenar lo siguiente:

```diff
+TELEGRAM_TOKEN='<YOUR TOKEN HERE>'
+TELEGRAM_TOKEN_DEBUG='<YOUR TOKEN HERE>'
+TELEGRAM_TEST_GROUP_ID='<GROUP_ID>'

# retryWrites=true&w=majority IS REQUIRED FOR MONGODB ATLAS
+MONGODB_URI='mongodb+srv://example.com/databasename?retryWrites=true&w=majority'
+MONGODB_USER='username'
+MONGODB_PASSWORD='password'

TMDB_URL='https://api.themoviedb.org/3'
+TMDB_API_KEY='<YOUR API KEY HERE>'

DEBUG="false"

TIMEZONE="Europe/Madrid"
```

## Estructura
```
./
├── 📁 .vscode
│   ├── 📄 extensions.json
│   └── 📄 settings.json
├── 📁 src
│   ├── 📁 bot
│   │   ├── 📁 commands
│   │   │   ├── 📄 deleteshow.command.ts
│   │   │   ├── 📄 newshow.command.ts
│   │   │   ├── 📄 nextepisodes.command.ts
│   │   │   ├── 📄 shows.command.ts
│   │   │   └── 📄 start.command.ts
│   │   ├── 📄 index.ts
│   │   └── 📁 middleware
│   │       └── 📄 index.ts
│   ├── 📁 config
│   │   └── 📄 index.ts
│   ├── 📁 interfaces
│   │   ├── 📄 customcontext.interface.ts
│   │   ├── 📄 show.interface.ts
│   │   └── 📄 user.interface.ts
│   ├── 📁 libs
│   │   └── 📄 logger.ts
│   ├── 📁 loaders
│   │   ├── 📄 index.ts
│   │   ├── 📄 mongoose.loader.ts
│   │   ├── 📄 telegraf.loader.ts
│   │   └── 📄 tmdb.loader.ts
│   ├── 📁 models
│   │   ├── 📄 show.model.ts
│   │   └── 📄 user.model.ts
│   ├── 📁 scripts
│   │   └── 📄 optimize-users.ts
│   ├── 📁 services
│   │   ├── 📄 show.service.ts
│   │   ├── 📄 telegraf.service.ts
│   │   ├── 📄 tmdb.service.ts
│   │   └── 📄 user.service.ts
│   └── 📄 app.ts
├── 📄 .env.sample
├── 📄 .eslintignore
├── 📄 .eslintrc.yaml
├── 📄 .gitignore
├── 📄 .prettierrc.yaml
├── 📄 config.json.dist
├── 🔑 LICENSE
├── 📄 package-lock.json
├── 📄 package.json
├── ℹ️ README.md
└── 📄 tsconfig.json
```

## Ejecución
```
$ node main.js
```


[npm-image]: https://img.shields.io/badge/npm-8.3.1-critical
[npm-url]: https://www.npmjs.com/
[node-image]: https://img.shields.io/badge/node-16.14.0-success
[node-url]: https://nodejs.org/en/
[typescript-image]: https://img.shields.io/badge/node-14.16.0-success
[typescript-url]: https://nodejs.org/en/
[telegram-image]: https://img.shields.io/badge/%40nuevoepisodio__bot-blue?logo=telegram
[telegram-url]: https://t.me/nuevoepisodio_bot
