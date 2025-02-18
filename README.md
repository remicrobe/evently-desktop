# Evently - Application de Suivi d'Événements (Vue3 + Electron)

## Description

**Evently** est une application de suivi d'événements permettant de gérer et suivre des événements dans un environnement centralisé. Développée avec **Vue3** pour le frontend et **Electron** pour une expérience desktop multiplateforme (Mac, Windows et Linux), **Evently** vous offre une gestion simple et intuitive de vos événements.

L'application intègre un système d'auto-déploiement, générant des versions web et des builds pour toutes les plateformes avec une signature automatique via un pipeline **CI/CD**, garantissant ainsi sécurité et intégrité.

## Fonctionnalités

- **Gestion d'événements** : Créez, modifiez et suivez vos événements avec une interface simple et réactive.
- **Multiplateforme** : Disponible sur **Mac**, **Windows**, et **Linux**.
- **Auto-déploiement** : Déploiement automatique de l'application web et des builds desktop.
- **Signature automatique** : Les applications sont signées automatiquement via le pipeline CI/CD pour garantir leur sécurité et éviter les alertes de sécurité.
- **Mises à jour automatiques** : L'application se met à jour automatiquement via le mécanisme de mise à jour intégré.

## Prérequis

- Node.js (version recommandée : `v16.x` ou plus)
- Vue CLI
- Electron
- Git
- Un accès à un pipeline CI/CD (par exemple, GitLab CI, GitHub Actions, etc.)

## Installation

1. Clonez le dépôt de **Evently** :

   ```bash
   git clone https://github.com/remicrobe/evently-desktop
   ```

2. Allez dans le répertoire du projet :

   ```bash
   cd evently-desktop
   ```

3. Installez les dépendances :

   ```bash
   npm install
   ```

## Développement

Pour démarrer l'application en mode développement, utilisez la commande suivante :

```bash
npm run dev
```

## Build et Distribution

Pour créer une version de production de l'application (web et desktop), exécutez la commande suivante :

```bash
npm run build
```

- Cette commande génère une release dans le répertoire `release/`.
- Elle crée également les installateurs pour Mac, Windows et Linux (en fonction de la plateforme executant la commande).

### CI/CD et Signature Automatique

Le pipeline CI/CD est configuré pour signer automatiquement les applications de bureau (Mac, Windows) et les déployer sur les apparails.

Les étapes suivantes sont prises en charge automatiquement :

- **Création du build** pour chaque plateforme.
- **Signature du code** pour Mac et Windows pour éviter les avertissements de sécurité.
- **Déploiement automatique** sur GitHub.

## Mise à jour automatique

**Evently** prend en charge les mises à jour automatiques grâce à l'intégration avec **Electron Updater**. Lorsqu'une nouvelle version est publiée, l'application se met à jour automatiquement pour garantir que les utilisateurs utilisent toujours la version la plus récente.

## Licence

Ce projet est sous licence [MIT](LICENSE).
