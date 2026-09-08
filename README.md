# Teckpokal Results

Schlanke öffentliche Ergebnisübersicht für das Teckpokalfliegen: [faegerliho.github.io/TeckpokalResults](https://faegerliho.github.io/TeckpokalResults/)

## Ergebnisse ergänzen

- Die Jahresdaten liegen in `data/results.json`.
- Die Original-PDFs liegen unter `results/<Jahr>/`.
- Für 2026 ist `results/2026/` bereits vorbereitet. Finale PDF dort ablegen und die Ergebnisse in `data/results.json` ergänzen.

Die Ergebnisse eines Jahres liegen in `events[].rankings[]`. So können Gesamtwertung, Mannschaftswertung, Klassen- und Sonderwertungen getrennt angezeigt werden. Die Klassen sind `Junior`, `Senior` und `Edelsenior`.

```json
{
  "id": "overall",
  "label": "Gesamtwertung",
  "results": [
    {
      "place": 1,
      "startNumber": 67,
      "pilot": "Name",
      "class": "Senior",
      "team": "Mannschaft",
      "special": null,
      "points": 4930.76,
      "percent": 100.0
    }
  ]
}
```

Die Seite startet automatisch mit dem neuesten Jahr, das Ergebnisse enthält. Nach einem Commit auf `main` veröffentlicht GitHub Actions die Seite automatisch.

## Lokal ansehen

```bash
python3 -m http.server 8000
```

Dann `http://localhost:8000` öffnen.
