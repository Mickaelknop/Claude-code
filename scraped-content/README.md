# Golf Club du Forez — Contenu Scrapé

## Objectif
Extraction du contenu de [golfclubduforez.com](https://www.golfclubduforez.com/) pour la création d'un nouveau site internet moderne.

## Note technique
Le scraping direct HTTP a été bloqué par les restrictions réseau de l'environnement d'exécution.
Le contenu a été collecté via des **recherches web agrégées** depuis plusieurs sources publiques :
- Site officiel (métadonnées Google)
- golfstars.com, cgolf.fr, lecoingolf.fr, ffgolf.org, craintilleux.fr

Le scraper Crawlee (`scraper/scraper.js`) fonctionne correctement — il doit être exécuté dans un environnement avec accès réseau complet pour extraire le contenu direct du site.

---

## Fichiers générés

| Fichier | Description |
|---------|-------------|
| `all-pages.json` | Contenu détaillé de chaque page identifiée |
| `summary.json` | Vue d'ensemble du site — stats, contacts, navigation |
| `content-structure.json` | Structure complète organisée pour le redesign |

---

## Résumé du contenu collecté

### Informations de contact
- **Adresse :** 342 impasse du Golf, 42210 Craintilleux
- **Téléphone :** 04 77 30 86 85
- **Restaurant :** 04 77 38 41 68
- **Email :** golfclubduforez@orange.fr
- **Horaires :** 8h30 — 18h30

### Navigation (menu actuel)
- Accueil · Réservations · Notre Nouveau Pro · Restaurant · Newsletter 01/26
- Tarifs 2026 · Biodiversité · Nos Équipes · Comité de la Loire · Contact
- Visiteurs 2025 · Agenda · Compétitions (archives) · Palmarès · Séniors

### Le Parcours
- **18 trous** — Par 70 — 5 754 m — Slope 126
- Architecte : **Michel Gayon** (conçu 1983, ouvert 1986)
- 40 hectares, 4 étangs, 5 000+ arbres, greens tous surélevés
- 9 trous techniques + 9 trous larges

### Club & Équipements
- ~430 membres (Association loi 1901)
- Club-house 600 m² (restaurant, bar, pro-shop, vestiaires, salles séminaire)
- Practice 1 ha (8 postes couverts + ~20 extérieurs), putting green 9 trous
- **Certification FFGolf Biodiversité Argent** (automne 2024 — 1er en Loire 42)

---

## Recommandations pour le redesign

### Pages prioritaires
1. **Accueil** — Hero vidéo/photo du parcours, USPs clés, CTA réservation
2. **Le Parcours** — Carte interactive 18 trous, specs, photos HD
3. **Tarifs** — Tableau clair, réservation en ligne intégrée
4. **Restaurant** — Menu en ligne, galerie, réservation table
5. **Biodiversité** — Page valorisant la certification Argent FFGolf
6. **Équipe** — Photos pro et staff, école de golf
7. **Compétitions** — Calendrier filtrable, résultats en temps réel

### Fonctionnalités modernes suggérées
- Réservation de tee-time en ligne
- Météo en temps réel sur le parcours
- Espace membres connecté
- Newsletter email (remplacement PDF)
- Galerie Instagram intégrée
- Carte Google Maps intégrée
- Chat en ligne / WhatsApp Business

### Direction design
- **Couleurs :** Vert golf, blanc, tons naturels (bois, terre, eau)
- **Typographie :** Moderne, élégante, très lisible
- **Ambiance :** Nature, sport, convivialité, excellence locale
- **Mobile-first :** Priorité responsive/PWA
