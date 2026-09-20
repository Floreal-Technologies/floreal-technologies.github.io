+++
title = "MediaCopy 3000"
description = "MediaCopy 3000 transfère vos médias entre volumes de stockage et vérifie chaque copie avec un manifeste ASC MHL."

[extra]
what = "Application de bureau"

[[extra.actions]]
label = "L'installer"
url = "https://docs.floreal.tech/mediacopy3000/fr/installation"
primary = true

[[extra.actions]]
label = "Lire le manuel"
url = "https://docs.floreal.tech/mediacopy3000/fr/"

[[extra.actions]]
label = "Le code sur GitHub"
url = "https://github.com/Floreal-Technologies"
+++

Transferts de médias sécurisés entre vos volumes de stockage,
depuis le plateau jusqu'en post-prod. Assurez-vous de la
**complétude** et la **sûreté** de vos données.

<!-- more -->

## Ce qu'elle fait

MediaCopy 3000 (MC3K) copie vos médias d'une carte mémoire vers vos volumes de
stockage. Elle calcule l'empreinte de chaque fichier, puis elle relit chaque
copie et compare les empreintes. Une copie qui ne correspond pas est signalée.
Vous savez que le transfert est complet avant de formater la carte.

## Une intégrité qui reste avec les données

MC3K écrit un manifeste ASC Media Hash List (MHL) à côté de vos fichiers. Le
format est ouvert. Tout outil qui lit le MHL peut vérifier les mêmes données
plus tard, sur une autre machine et avec un autre logiciel.

Vous pouvez aussi **sceller** une source sur place. MC3K lit le volume et écrit
le manifeste sans faire de copie. Une copie faite plus tard dispose alors des
empreintes d'origine pour la vérification.

## Aucune surprise

MC3K affiche un plan d'exécution avant de commencer. Le plan liste chaque
source, chaque destination et chaque action. Vous validez le plan, puis la file
d'attente l'exécute.

## Plateformes supportées

MC3K est disponible sur les plateformes suivantes:

* Microsoft Windows
* macOS 15+
* Debian/Ubuntu
* Fedora
* Arch Linux

Le code source est publié sous licence GPL-3.0.
