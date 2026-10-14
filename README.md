# 💰 Moneyluck

Application de gestion d'argent (comptes, transactions, budgets, objectifs, investissements).
**PWA** : installable sur Android en plein écran (sans barre de navigateur), 100 % hors ligne,
et prête pour [PWABuilder](https://www.pwabuilder.com) → APK / AAB.

## Contenu du dossier (tout est à la racine, aucun sous-dossier d'images)

| Fichier | Rôle |
|---|---|
| `index.html` | L'application |
| `manifest.json` | Manifest PWA (`display: standalone`, icônes, captures, raccourcis) |
| `sw.js` | Service worker : cache hors ligne + mises à jour |
| `offline.html` | Page de secours hors ligne |
| `icon-48.png` … `icon-512.png` | Icônes classiques |
| `maskable-192.png`, `maskable-512.png` | Icônes adaptatives Android |
| `monochrome-512.png` | Icône thématique Android 13 |
| `apple-touch-icon.png`, `favicon-16.png`, `favicon-32.png` | iOS et onglet |
| `screenshot-mobile-1..3.png`, `screenshot-desktop-1.png` | Captures pour l'installation |
| `.well-known/assetlinks.json` | Vérification du domaine (à remplir, voir étape 3.4) |
| `.nojekyll` | Nécessaire pour que GitHub Pages serve `.well-known/` |
| `tools/` | Outils optionnels : `generate_icons.py` (icônes) et `validate.py` (test type PWABuilder) |

> Le seul sous-dossier obligatoire est `.well-known/` (fichier caché). Vérifie après envoi que
> `https://TON-DOMAINE/.well-known/assetlinks.json` s'ouvre.

## 1. Mettre en ligne sur GitHub Pages

1. Crée un dépôt sur github.com, puis envoie tout le contenu de ce dossier **à la racine** du dépôt
   (attention aux fichiers cachés : `.nojekyll` et `.well-known/`).
2. **Settings → Pages → Build and deployment → Source : `Deploy from a branch`** → branche `main`, dossier `/ (root)` → Save.
3. Après ~1 minute, l'app est en ligne en HTTPS (obligatoire pour une PWA).

> ⚠️ **Important pour un APK sans barre d'adresse** : Android n'enlève la barre du haut (mode TWA)
> que si `https://TON-DOMAINE/.well-known/assetlinks.json` est accessible **à la racine du domaine**.
> Avec un dépôt normal (`ton-pseudo.github.io/moneyluck/`), ce fichier serait dans un sous-dossier
> → **la barre Chrome apparaîtrait dans l'APK**.
> Solution gratuite : nomme le dépôt **`ton-pseudo.github.io`** (l'app sera alors sur `https://ton-pseudo.github.io/`),
> ou utilise un domaine personnalisé.

## 2. Tester l'installation (sans APK)

Ouvre l'URL dans Chrome Android → menu ⋮ → **Installer l'application**. Elle s'ouvre en plein écran, comme une app native.

## 3. Générer l'APK avec PWABuilder

1. Va sur <https://www.pwabuilder.com>, colle l'URL de ton site, clique **Start**.
2. Le rapport doit être au vert (manifest, service worker, HTTPS, icônes, captures).
3. **Package for stores → Android → Generate package**.
   - *Package ID* : par ex. `io.github.ton_pseudo.moneyluck`
   - Garde « Signing key : Create new », puis **télécharge et conserve la clé + les mots de passe**.
4. Dans le zip téléchargé, copie le contenu de `assetlinks.json` dans `.well-known/assetlinks.json` de ton dépôt, puis `git push`.
   Vérifie que `https://TON-DOMAINE/.well-known/assetlinks.json` s'affiche dans le navigateur.
5. Installe `app-release-signed.apk` sur ton téléphone (autorise les sources inconnues). Le `.aab` sert pour le Play Store.

## Mettre à jour l'app

Modifie `index.html`, puis dans `sw.js` change `CACHE_VERSION` (ex. `v1.0.1`) et `git push`.
L'APK (TWA) charge toujours la dernière version du site : inutile de le regénérer.

## Données

Tout est stocké localement (`localStorage`) sur l'appareil. Les données de l'app installée et celles du navigateur
sont séparées ; vider les données de l'app les efface.
