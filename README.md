# esgi-nodejs-projet
Cours Node.jsCours Node.js - Réalisation d'une API pour un client

## Framework
Pour ce projet nous utilisons le Framework Fastify à la place du populaire Express.
Fastify a l’avantage notable d’être plus rapide qu’Express, il traite en effet un nombre de requêtes à la seconde plus important. 
Fastify permet également une gestion des erreurs plus simplifié. Les erreurs sont directement transmises au Handler qui va lui-même gérer les erreurs. 

sources : 
https://javascript.plainenglish.io/fastify-express-benchmark-4c4aebb726d6
https://medium.com/@onufrienkos/express-vs-fastify-performance-4dd5d73e08e2
https://www.codeheroes.fr/2021/03/29/a-la-decouverte-de-fastify/


## Installation

- Clonner le repos
```
    git clone https://github.com/dd701116/esgi-nodejs-projet.git
```

- Installer les dépendances
```
    cd esgi-nodejs-projet
    npm install
```

- Installer le serveur mongodb (avec docker)
```sh
    docker run --rm --publish 27017:27017 --name mongodb-pour-nodejs mongo:4
```

- Tester la connexion au serveur mongo
```sh
    docker run --rm -it --link mongodb-pour-nodejs:mongo mongo:4 mongo --host mongo test
```

- Lancer le serveur
```
    // First replace production=true by production=false in the config.default.json
    // and after start the server
    npm start
```

## Déploiement sur Heroku

```
$ git add .
$ git commit -m "Added a Procfile."
$ heroku login
Enter your Heroku credentials.
...
$ heroku create
Creating arcane-lowlands-8408... done, stack is cedar
https://esgi-nodejs-projet.herokuapp.com/ | git@heroku.com:esgi-nodejs-projet.git
Git remote heroku added
$ git push heroku main
```

## Les endpoints

## DEMO

Déployé sur heroku => https://esgi-nodejs-projet.herokuapp.com/

<br>
<hr>

Site web source :
- https://adrienjoly.com/cours-nodejs/
