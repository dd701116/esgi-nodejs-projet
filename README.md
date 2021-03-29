# esgi-nodejs-projet
Cours Node.jsCours Node.js - Réalisation d'une API pour un client


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
