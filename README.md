# Planneo 🗓️

Application PWA de gestion de planning horaires pour boutiques et commerces. Mobile-first, avec export PDF et stockage local.

## 🚀 Fonctionnalités

- ✅ **Gestion des utilisateurs** : Ajouter/modifier/supprimer des employés
- ✅ **Planning visuel** : Interface calendrier intuitive pour créer des créneaux horaires
- ✅ **Calcul automatique** : Heures travaillées, pauses, totaux mensuels
- ✅ **Export PDF** : Rapports détaillés ou simples en PDF
- ✅ **PWA** : Installation sur mobile, mode hors ligne
- ✅ **Stockage local** : Toutes les données sauvegardées localement
- ✅ **Mobile-First** : Interface optimisée pour mobile avant desktop
- ✅ **Accessibilité** : Contraste élevé, navigation clavier, labels ARIA
- ✅ **Performance** : Chargement rapide, animations fluides

## 🛠️ Technologies

- **Next.js 15** avec App Router et Turbopack
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling responsive
- **jsPDF + html2canvas** pour l'export PDF
- **Lucide React** pour les icônes accessibles
- **PWA** avec next-pwa et service worker
- **CSS personnalisé** pour l'accessibilité et performance
- **localStorage** pour la persistance des données

## 📱 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation locale
```bash
# Cloner le repository
git clone https://github.com/tonylapoche/planeo.git
cd planeo

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

## 🎯 Architecture Clean

L'application suit une **architecture modulaire** avec séparation des responsabilités :

```
src/
├── app/                    # Pages Next.js (Routes)
│   ├── page.tsx           # Page d'accueil
│   ├── users/             # Gestion utilisateurs
│   ├── planning/          # Planning principal
│   ├── reports/           # Rapports et exports
│   └── settings/          # Paramètres
├── components/            # Composants réutilisables
│   ├── calendar/          # Composants du calendrier
│   │   ├── CalendarGrid.tsx
│   │   ├── TeamLegend.tsx
│   │   └── PlanningInstructions.tsx
│   └── icons.tsx          # Icônes personnalisées
├── hooks/                 # Hooks personnalisés
│   └── usePlanning.ts     # Logique du planning
├── types/                 # Types TypeScript
│   └── index.ts           # Définition des interfaces
└── utils/                 # Utilitaires métier
    ├── storage.ts         # Gestion localStorage
    ├── time.ts            # Calculs horaires
    └── pdfExport.ts       # Export PDF
```

📖 **[Documentation complète de l'architecture](ARCHITECTURE.md)**

### **Principe SOLID appliqué :**
- **S** : Single responsibility (une tâche par composant)
- **O** : Open/closed (extensible sans modification)
- **L** : Liskov substitution (interfaces cohérentes)
- **I** : Interface segregation (interfaces minimales)
- **D** : Dependency inversion (dépendances abstraites)

## 🔧 Configuration PWA

L'app est configurée pour fonctionner hors ligne avec :
- Service Worker automatique
- Cache des ressources statiques
- Manifest pour installation mobile
- Thème et icônes personnalisés

## ♿ Accessibilité

L'application respecte les standards d'accessibilité WCAG 2.1 :
- **Contraste élevé** : Ratio minimum 4.5:1 pour tous les éléments texte
- **Navigation clavier** : Tous les éléments interactifs accessibles au clavier
- **Labels ARIA** : Descriptions complètes pour les lecteurs d'écran
- **Focus visible** : Indicateurs de focus clairs et visibles
- **Tailles tactiles** : Boutons minimum 44x44px sur mobile
- **Texte redimensionnable** : Support du zoom jusqu'à 200%
- **Prévention du zoom** : Font-size minimum 16px sur mobile

## 📱 Design Mobile-First

L'interface est conçue mobile-first avec :
- **Navigation adaptative** : Menu hamburger sur mobile, navigation fixe sur desktop
- **Grille responsive** : Layouts qui s'adaptent à tous les écrans
- **Typographie fluide** : Tailles de texte adaptées aux appareils
- **Espace tactile** : Boutons et liens optimisés pour le toucher
- **Performance** : Animations CSS légères, pas de JavaScript lourd
- **Économie de données** : Images optimisées, cache intelligent

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
- [ ] Mode sombre/clair complet
- [ ] Multi-langues (i18n)
- [ ] Partage de planning par QR code
- [ ] Intégration calendrier Google/Outlook

## 📝 Licence

**Licence Propriétaire - Planneo**

Cette application est la propriété exclusive d'Antoine Terrade. Tous droits réservés.

### ✅ Utilisations autorisées :
- Usage personnel uniquement
- Utilisation professionnelle pour la gestion de votre propre planning
- Modification du code pour usage personnel

### ❌ Interdictions :
- Utilisation commerciale (vente, location, distribution)
- Redistribution du code source ou de l'application
- Utilisation dans un cadre professionnel pour des tiers
- Création de produits dérivés
- Partage public du code source

### 📞 Contact :
Pour toute question concernant la licence ou utilisation commerciale, contactez :
**Antoine Terrade** - [contact@antoineterrade.com](mailto:contact@antoineterrade.com)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

**Développé avec ❤️ pour simplifier la gestion des plannings horaires**
