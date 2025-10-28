# 🔧 Fix : Positionnement de l'image sur le template

## 🐛 Problème Identifié

Après l'upgrade HD (canvas 360×520px → 720×1040px), l'image du combattant apparaissait **tout petit** sur le template.

**Cause** : Les positions dans le template étaient toujours calculées pour l'ancien canvas (360px) alors que le nouveau canvas fait 720px.

---

## ✅ Solution Implémentée

Toutes les positions ont été **doublées** pour correspondre au nouveau canvas :

### Avant (360×520px)
```javascript
positions: {
  photo: { x: 50, y: 80, width: 260, height: 280 },
  rating: { x: 35, y: 40, fontSize: 32 },
  // ...
}
```

### Après (720×1040px)
```javascript
positions: {
  photo: { x: 100, y: 160, width: 520, height: 560 },  // ×2
  rating: { x: 70, y: 80, fontSize: 64 },              // ×2
  // ...
}
```

---

## 📁 Fichiers Modifiés

| Fichier | Modification |
|---------|-------------|
| [app/page.tsx](app/page.tsx) | ✅ Positions doublées dans les 2 templates par défaut |
| [supabase-update-positions-hd.sql](supabase-update-positions-hd.sql) | ✅ Script SQL pour mettre à jour Supabase |

---

## 🚀 Si vous avez des templates dans Supabase

Exécutez le script SQL :

1. Allez sur https://supabase.com/dashboard
2. SQL Editor
3. Copiez-collez [supabase-update-positions-hd.sql](supabase-update-positions-hd.sql)
4. Run

---

## 📐 Règle de Conversion

Pour tout nouveau template ou ajustement :

```
Nouvelle valeur = Ancienne valeur × 2
```

**Exemples** :
- Position X : `50px → 100px`
- Width : `260px → 520px`
- FontSize : `32 → 64`

---

## 🎨 Positionnement Actuel (720×1040px)

Voici le mapping complet pour le canvas HD :

```javascript
{
  // Photo du combattant (centre)
  photo: {
    x: 100,       // Marge gauche
    y: 160,       // Position verticale
    width: 520,   // Largeur de la photo
    height: 560   // Hauteur de la photo
  },

  // Note globale (haut gauche)
  rating: {
    x: 70,        // Marge gauche
    y: 80,        // Marge haut
    fontSize: 64  // Taille du texte
  },

  // Sport "MMA" (sous la note)
  sport: {
    x: 70,
    y: 164,
    fontSize: 28
  },

  // Username (haut centre)
  username: {
    x: 360,       // Centre horizontal
    y: 70,
    fontSize: 32
  },

  // Nom du combattant (bas centre)
  name: {
    x: 360,       // Centre horizontal
    y: 680,       // Vers le bas
    fontSize: 56
  },

  // Drapeau (haut droite)
  flag: {
    x: 560,       // Vers la droite
    y: 90,
    width: 70,
    height: 50
  },

  // Statistiques (tout en bas)
  stats: {
    x: 70,
    y: 780,       // Bas de la carte
    fontSize: 28
  }
}
```

---

## 🧪 Comment Tester

1. Rechargez votre application
2. Uploadez une photo
3. ✅ La photo devrait maintenant **remplir correctement** la zone prévue
4. ✅ Tous les textes devraient être **bien positionnés**

---

## 🎯 Ajustements Fins (si nécessaire)

Si vous voulez ajuster légèrement les positions :

### Dans le code (app/page.tsx)
```javascript
photo: {
  x: 100,   // ← Ajustez ici (déplace horizontalement)
  y: 160,   // ← Ajustez ici (déplace verticalement)
  width: 520,  // ← Ajustez ici (largeur)
  height: 560  // ← Ajustez ici (hauteur)
}
```

### Dans Supabase (via SQL)
```sql
UPDATE templates
SET positions = jsonb_set(
  positions,
  '{photo,x}',
  '120'  -- Nouvelle valeur
)
WHERE name = 'UFC Style Card';
```

---

## 📊 Comparaison Visuelle

### Avant (Problème)
```
┌─────────────────────────────┐
│ 85  MMA                     │
│                             │
│    [mini photo]             │
│                             │
│         FIGHTER             │
│                             │
│   Stats                     │
└─────────────────────────────┘
```

### Après (Fixé)
```
┌─────────────────────────────┐
│ 85  MMA            🇫🇷      │
│                             │
│   ┌─────────────────┐       │
│   │                 │       │
│   │   PHOTO HD      │       │
│   │                 │       │
│   └─────────────────┘       │
│                             │
│       F I G H T E R         │
│                             │
│  FORCE: 90   RAPIDITÉ: 85   │
└─────────────────────────────┘
```

---

## ✅ Statut

- [x] Positions doublées dans app/page.tsx
- [x] Script SQL créé pour Supabase
- [x] Documentation mise à jour
- [x] Prêt à tester

---

**Le positionnement est maintenant correct pour le canvas HD !** 🎉
