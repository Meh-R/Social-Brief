# social GIF;

Social GIF est une application social dans l'aquel il est possible de poster des images et videos, de suivre des utilateurs, de commenter et liké les postes

L'application est construite a l'aide des tecnologie comme Node.js, Express.js, MySQL2, MongoDB, JWT pour l'authentification, Multer pour gérer les données multiparts/formulaires, Nodemailer pour l'envoie des emails.

## Table of Contents

- [Installation](#installation)
- [KeyFeatures](#KeyFeatures)
- [Usage](#Usage)
- [License](#license)

## Installation

Crée une base de donnée:
Ce reférer au fichier sql disponible dans le repositorie.

Installer les dépendances:
npm i bcrypt, bson, cordoten, ejs, express, jsonwebtoke, mongodb, multer, mysql2, nodemailer, nodemon, router, validator

Crée un .env :
referer vous au .env.exemple

Remplasser: Dans backend/src/Controller/User/ligne63 process.env.EMAIL par email et ligne177 process.env.EMAIL par email

Crée un dossier nommé uploads dans backend/src/Controller 

## KeyFeatures

- Creation de compte avec validation par email.
- Recuperation d'un mot de passe oublié
- Creation de postes avec image ou video
- Possibilité de rechercher des utisateurs, de liker, de commenter et de suivre leurs postes

## Usage

Pour lancé l'application

back end:

- npm start

front end:

- utiliser Go Live

## License

Pas de license
