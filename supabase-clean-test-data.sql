-- Script pour nettoyer toutes les données de test
-- ⚠️ ATTENTION : Ce script supprime TOUTES les commandes de la base de données !
-- Exécutez-le uniquement en environnement de développement ou pour repartir à zéro

-- Supprimer toutes les commandes
DELETE FROM orders;

-- Réinitialiser les séquences si nécessaire
-- (Les UUIDs ne nécessitent pas de réinitialisation)

-- Vérifier que tout est vide
SELECT COUNT(*) as remaining_orders FROM orders;

-- Ce script devrait retourner 0 si tout a été correctement supprimé
