# 🏗️ Architecture Clean de Planneo

## Vue d'ensemble

Ce projet suit les principes de **Clean Architecture** avec une séparation claire des responsabilités et une organisation modulaire du code.

## 📁 Structure des dossiers

```
src/
├── app/                    # Pages Next.js (Routes)
│   ├── page.tsx           # Page d'accueil
│   ├── users/             # Gestion utilisateurs
│   ├── planning/          # Planning principal
│   ├── reports/           # Rapports et exports
│   └── settings/          # Configuration
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
├── utils/                 # Utilitaires métier
│   ├── storage.ts         # Gestion localStorage
│   ├── time.ts            # Calculs horaires
│   └── pdfExport.ts       # Export PDF
└── app/                   # Configuration Next.js
    ├── globals.css        # Styles globaux accessibles
    ├── layout.tsx         # Layout principal
    └── favicon.ico
```

## 🧩 Principes de Clean Architecture

### 1. **Séparation des responsabilités**
- **UI (Components)** : Affichage et interactions utilisateur
- **Business Logic (Hooks)** : Logique métier et état
- **Data (Utils)** : Accès aux données et calculs
- **Types** : Définition des contrats de données

### 2. **Dépendances unidirectionnelles**
```
Components → Hooks → Utils → Types
    ↓         ↓       ↓
   UI      Business  Data
```

### 3. **Composants réutilisables**
Chaque composant a une responsabilité unique :
- `CalendarGrid` : Affichage du calendrier
- `TeamLegend` : Légende de l'équipe
- `PlanningInstructions` : Instructions utilisateur

## 🎯 Avantages de cette architecture

### ✅ **Maintenabilité**
- Code organisé et facile à comprendre
- Modifications isolées aux composants
- Tests unitaires facilités

### ✅ **Réutilisabilité**
- Composants indépendants et réutilisables
- Hooks personnalisés partagés
- Utilitaires transversaux

### ✅ **Évolutivité**
- Ajout de nouvelles fonctionnalités simplifié
- Modification de l'UI sans impacter la logique
- Extension facile des types

### ✅ **Testabilité**
- Logique métier séparée de l'UI
- Hooks testables indépendamment
- Composants isolables pour les tests

## 🔄 Flux de données

### Hook personnalisé (`usePlanning`)
```typescript
const {
  users,           // État des utilisateurs
  shifts,          // État des créneaux
  currentMonth,    // Mois actuel
  calendarDays,    // Jours du calendrier
  loadData,        // Recharger les données
  navigateMonth,   // Navigation mensuelle
  // ... autres fonctions
} = usePlanning();
```

### Composants enfants
```typescript
<CalendarGrid
  calendarDays={calendarDays}
  shifts={shifts}
  onDateClick={handleDateClick}
  onEditShift={handleEditShift}
  // Props clairement définies
/>
```

## 📋 Responsabilités par couche

### **Couche Présentation (Components)**
- Rendu visuel des données
- Gestion des événements utilisateur
- États locaux temporaires
- Accessibilité et responsive design

### **Couche Métier (Hooks)**
- Logique applicative principale
- Gestion des états globaux
- Coordination des actions
- Validation des données

### **Couche Infrastructure (Utils)**
- Accès aux données (localStorage)
- Calculs métier complexes
- Services externes (PDF, etc.)
- Utilitaires transversaux

### **Couche Domaine (Types)**
- Définition des entités métier
- Interfaces et contrats
- Types de données partagés

## 🚀 Bonnes pratiques appliquées

### **1. Single Responsibility Principle**
Chaque fichier/composant a une responsabilité unique :
- `CalendarGrid.tsx` : Uniquement l'affichage du calendrier
- `usePlanning.ts` : Uniquement la logique du planning
- `storage.ts` : Uniquement la persistance des données

### **2. DRY (Don't Repeat Yourself)**
- Hooks réutilisables pour éviter la duplication
- Composants génériques et configurables
- Utilitaires partagés entre composants

### **3. SOLID Principles**
- **S** : Single responsibility (chaque élément une tâche)
- **O** : Open/closed (extensible sans modification)
- **L** : Liskov substitution (interfaces cohérentes)
- **I** : Interface segregation (interfaces minimales)
- **D** : Dependency inversion (dépendances abstraites)

### **4. Atomic Design**
- **Atoms** : Boutons, inputs, icônes
- **Molecules** : Composants de formulaire, cartes
- **Organisms** : Sections complexes (calendrier, légende)
- **Templates** : Layouts des pages
- **Pages** : Pages complètes

## 🧪 Tests et qualité

### **Structure de test recommandée**
```
__tests__/
├── components/
│   ├── calendar/
│   │   ├── CalendarGrid.test.tsx
│   │   ├── TeamLegend.test.tsx
│   │   └── PlanningInstructions.test.tsx
├── hooks/
│   └── usePlanning.test.ts
└── utils/
    ├── storage.test.ts
    ├── time.test.ts
    └── pdfExport.test.ts
```

### **Types de tests**
- **Tests unitaires** : Composants et hooks isolés
- **Tests d'intégration** : Interactions entre composants
- **Tests E2E** : Parcours utilisateur complets

## 🔮 Évolutions futures

### **1. État global (Zustand/Redux)**
```typescript
// Remplacer les hooks par un store global
const usePlanningStore = create<PlanningState>((set, get) => ({
  users: [],
  shifts: [],
  // ... logique centralisée
}));
```

### **2. API REST**
```typescript
// Couche d'abstraction pour les données
interface DataProvider {
  getUsers(): Promise<User[]>;
  saveShift(shift: Shift): Promise<void>;
}

// Implémentation locale
class LocalDataProvider implements DataProvider { ... }

// Implémentation API
class ApiDataProvider implements DataProvider { ... }
```

### **3. Microservices**
- Service d'authentification
- Service de notifications
- Service de génération de rapports

Cette architecture clean assure une base solide pour l'évolution et la maintenance du projet Planneo. 🎯
