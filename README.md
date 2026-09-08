# Teckpokal Results

Schlanke öffentliche Ergebnisübersicht für das Teckpokalfliegen: [faegerliho.github.io/TeckpokalResults](https://faegerliho.github.io/TeckpokalResults/)

## Ergebnisse ergänzen

- Die Jahresdaten liegen in `data/results.json`.
- Die Original-PDFs liegen unter `results/<Jahr>/`.
- Für 2026 ist `results/2026/` bereits vorbereitet. Finale PDF dort ablegen und die Ergebnisse in `data/results.json` ergänzen.

Ein Ergebnis sieht so aus:

```json
{
  "place": 1,
  "startNumber": 67,
  "pilot": "Name",
  "class": "Senior",
  "points": 4930.76,
  "percent": 100.0
}
```

Die Klassen sind `Junior`, `Senior` und `Edelsenior`. Nach einem Commit auf `main` veröffentlicht GitHub Actions die Seite automatisch.

## Lokal ansehen

```bash
python3 -m http.server 8000
```

Dann `http://localhost:8000` öffnen.
