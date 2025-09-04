# Planning Local 🗓️

Application PWA de gestion de planning horaires pour boutiques et commerces. Mobile-first, avec export PDF et stockage local.

## 🚀 Fonctionnalités

- ✅ **Gestion des utilisateurs** : Ajouter/modifier/supprimer des employés
- ✅ **Planning visuel** : Interface calendrier intuitive pour créer des créneaux horaires
- ✅ **Calcul automatique** : Heures travaillées, pauses, totaux mensuels
- ✅ **Export PDF** : Rapports détaillés ou simples en PDF
- ✅ **PWA** : Installation sur mobile, mode hors ligne
- ✅ **Stockage local** : Toutes les données sauvegardées localement
- ✅ **Responsive** : Optimisé pour mobile et desktop

## 🛠️ Technologies

- **Next.js 15** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling
- **jsPDF** pour l'export PDF
- **Lucide React** pour les icônes
- **PWA** avec next-pwa

## 📱 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation locale
```bash
# Cloner le repository
git clone https://github.com/votre-username/planning-local.git
cd planning-local

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Installation PWA
1. Ouvrez l'app dans Chrome/Safari
2. Cliquez sur "Ajouter à l'écran d'accueil" ou "Installer l'app"
3. L'app sera disponible hors ligne

## 📖 Utilisation

### 1. Gestion des utilisateurs
- Allez dans **Utilisateurs**
- Ajoutez vos employés avec nom, email, téléphone
- Chaque employé a une couleur unique pour le planning

### 2. Création du planning
- Allez dans **Planning**
- Naviguez vers le mois souhaité
- Cliquez sur une date pour ajouter un créneau
- Définissez les horaires de début/fin et durée de pause

### 3. Export des rapports
- Allez dans **Rapports**
- Sélectionnez le mois
- Choisissez "Rapport simple" ou "Rapport détaillé"
- Le PDF se télécharge automatiquement

## 🎯 Architecture

```
src/
├── app/                    # Pages Next.js
│   ├── page.tsx           # Page d'accueil
│   ├── users/             # Gestion utilisateurs
│   ├── planning/          # Planning visuel
│   ├── reports/           # Rapports et exports
│   └── settings/          # Paramètres
├── types/                 # Types TypeScript
├── utils/                 # Utilitaires
│   ├── storage.ts         # Gestion localStorage
│   ├── time.ts           # Calculs horaires
│   └── pdfExport.ts      # Export PDF
└── components/           # Composants réutilisables
```

## 🔧 Configuration PWA

L'app est configurée pour fonctionner hors ligne avec :
- Service Worker automatique
- Cache des ressources statiques
- Manifest pour installation mobile
- Thème et icônes personnalisés

## 📊 Export de données

Dans **Paramètres** > **Gestion des données** :
- **Exporter** : Télécharge un fichier JSON avec toutes vos données
- **Importer** : Charge des données depuis un fichier exporté
- **Supprimer tout** : Efface toutes les données

## 🚀 Déploiement

### Sur Vercel (recommandé)
```bash
npm install -g vercel
vercel --prod
```

### Sur Netlify
```bash
npm run build
# Uploader le dossier .next/static et out/
```

## 💡 Idées d'amélioration

- [ ] Synchronisation cloud (Firebase, Supabase)
- [ ] Notifications push pour rappels
- [ ] Import depuis Excel existant
- [ ] Modèles de planning récurrents
- [ ] Statistiques avancées
- [ ] Version premium avec pubs

## 📝 Licence

MIT - Libre d'utilisation pour projets personnels et commerciaux.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

**Développé avec ❤️ pour simplifier la gestion des plannings horaires**
