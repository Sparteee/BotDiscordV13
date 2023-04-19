# Bot Discord V13

## Description

Ce projet est un bot discord sur la version 13 . Projet personnel pour expérimentation, découverte. Ce projet est toujours en cours de développement

## Objectif 

L'objectif de ce bot est large . C'est un application avec plusieurs fonctionlités disponible grâce à Discord avec des appels sur API Axios ou tout simplement des commandes de gestion sur des channels textuels de serveur Discord

# Fonctionalités

## Essence 

Avec l'exécution de la commande `!essence`, cela affiche un menu sélectif qui permet de choisir une ville prédéfine. Après le choix d'une ville, cela affiche les prix de tous les carburants de toutes les stations essences présentes dans la ville choisie. Les données proviennent de l'API "Prix des carburants J-7" de Opendatasoft.

## Translate 

Le bot permet de traduire n'importe quel texte dans la langue choisie par l'utilisateur
    Langues présentes :  
                        * Français `!fr <texteàtraduire>`  
                        * Allemand `!de <texteàtraduire>`  
                        * Anglais `!en <texteàtraduire>`  
                        * Espagnol `!es <texteàtraduire>`  
                        * Russe `!ru <texteàtraduire>`  
Cette traduction est réalise par Goolge traduction qui est appelé via l'API de Google Translate

## Followers

Récupération du nombres des followers twitter du compte renseigné par l'utilisateur dans la commande `!followers <compte>`. Récupération du nombres de followers via l'API Twitter

## Commandes généralistes 
`!infoserv` - Donne toutes les informations du serveur
`!help` - Donne toutes les commandes présentes sur le bot
`!ping` - Donne la latence du bot

Egalement, les messages présents dans les channels nommés "sql" ou "java" ou "php" se formatent automatiquement comme du code du nom du channel

# Installation

Exécutez dans un terminal ouvert dans le dossier : `npm install`
Remplir le fichier config.json avec vos tokens

```
    "token" :"TOKEN_DISCORD",
    "prefix" : "!",
    "keyAPI" : "CLE_API_GOOGLE",
    "TokenTwitter" : "TOKEN_TWITTER",
    "TokenTwitch": "TOKEN_TWITCH",
    "ClientIDTwitch": "CLIENT_ID_TWITCH"
```


