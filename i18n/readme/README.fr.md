# 🚀 **OpenHealth**

<div align="center">

**Assistant de Santé IA | Alimenté par Vos Données, Exécution Locale**

</div>

---

<div align="center">

### 🌍 Choisissez votre langue
[English](../../README.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [한국어](README.ko.md) | [中文](README.zh.md) | [日本語](README.ja.md)

</div>

---

## 🌟 Aperçu

> OpenHealth vous aide à **prendre en charge vos données de santé**. En exploitant l'IA et vos informations de santé personnelles,
> OpenHealth fournit un assistant privé et local qui vous aide à mieux comprendre et gérer votre santé.

## ✨ Caractéristiques du Projet

<details open>
<summary><b>Fonctionnalités Principales</b></summary>

- 📊 **Saisie Centralisée des Données de Santé :** Consolidez facilement toutes vos données de santé en un seul endroit.
- 🛠️ **Analyse Intelligente :** Analyse automatiquement vos données de santé et génère des fichiers de données structurées.
- 🤝 **Conversations Contextuelles :** Utilisez les données structurées comme contexte pour des interactions personnalisées avec l'IA alimentée par GPT.

</details>

## 📥 Sources de Données et Modèles de Langage Pris en Charge

<table>
  <tr>
    <th>Sources de Données Disponibles</th>
    <th>Modèles de Langage Pris en Charge</th>
  </tr>
  <tr>
    <td>
      • Résultats d'Analyses Sanguines<br>
      • Données de Bilan de Santé<br>
      • Informations Physiques Personnelles<br>
      • Antécédents Familiaux<br>
      • Symptômes
    </td>
    <td>
      • LLaMA<br>
      • DeepSeek-V3<br>
      • GPT<br>
      • Claude<br>
      • Gemini
    </td>
  </tr>
</table>

## 🤔 Pourquoi Nous Avons Créé OpenHealth

> - 💡 **Votre santé est votre responsabilité.**
> - ✅ La véritable gestion de la santé combine **vos données** + **l'intelligence**, transformant les insights en plans d'action.
> - 🧠 L'IA agit comme un outil impartial pour vous guider et vous soutenir dans la gestion efficace de votre santé à long terme.

## 🗺️ Diagramme du Projet

```mermaid
graph LR
    A[Données de Santé] --> B[Analyse et Traitement]
    B --> C[Base de Données Structurée]
    C --> D[Assistant IA]
    D --> E[Recommandations Personnalisées]
    E --> F[Suivi et Ajustement]
    F --> A
    
    style A fill:#ff7eb6,stroke:#ff2d7e,stroke-width:2px
    style B fill:#7afcff,stroke:#00b4ff,stroke-width:2px
    style C fill:#98fb98,stroke:#32cd32,stroke-width:2px
    style D fill:#ffa07a,stroke:#ff4500,stroke-width:2px
    style E fill:#dda0dd,stroke:#9370db,stroke-width:2px
    style F fill:#f0e68c,stroke:#bdb76b,stroke-width:2px
```

Entrée de données de santé --> Module d'analyse --> Fichiers de données structurées --> Intégration GPT

> **Remarque :** La fonctionnalité d'analyse des données est actuellement implémentée dans un serveur Python séparé et sera migrée vers TypeScript à l'avenir.

## Commencer

## ⚙️ Comment Exécuter OpenHealth

<details open>
<summary><b>Instructions d'Installation</b></summary>

1. **Cloner le Dépôt :**
   ```bash
   git clone https://github.com/OpenHealthForAll/open-health.git
   cd open-health
   ```

2. **Installer les Dépendances :**
   ```bash
   npm install
   ```

3. **Configuration du fichier .env:**

   Créez un fichier `.env` à la racine du projet et ajoutez le contenu suivant:
   ```bash
   DATABASE_URL="postgres://postgres:mysecretpassword@localhost:5432/open-health"
   OPENAI_API_KEY="your-openai-api-key"
   ```

4. **Configuration PostgreSQL:**

   Exécutez PostgreSQL avec Docker:

   ```bash
   # Lancer le conteneur PostgreSQL
   docker run -p 5432:5432 --name open-health -e POSTGRES_PASSWORD=mysecretpassword -d postgres
   ```

   Vérifier l'état du conteneur:
   ```bash
   docker ps
   ```

5. **Démarrer l'application:**
   ```bash
   npm run dev
   ```

4. **Accéder à OpenHealth :**
   Ouvrez votre navigateur et accédez à `http://localhost:3000` pour commencer à utiliser OpenHealth.

</details>

---

## 🌐 Communauté et Support

<div align="center">

[![Reddit](https://img.shields.io/badge/Reddit-FF4500?style=for-the-badge&logo=reddit&logoColor=white)](https://www.reddit.com/user/Dry_Steak30/)

</div> 