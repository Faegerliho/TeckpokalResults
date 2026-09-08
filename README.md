# Teckpokal Results

Öffentliche Ergebnisübersicht für das Teckpokalfliegen – als statische GitHub Page.

## Ergebnisse ergänzen

Die Seite liest `data/results.json`. Ein Event enthält ein Jahr und eine Ergebnisliste:

```json
{
  "updatedAt": "2026-09-08",
  "events": [
    {
      "year": 2026,
      "results": [
        { "place": 1, "pilot": "Name", "class": "Senior", "club": "Verein / Ort", "points": 1000 }
      ]
    }
  ]
}
```

Erlaubte Klassen sind `Junior`, `Senior` und `Edelsenior`. Nach einem Commit auf `main` wird die Seite automatisch neu veröffentlicht.

## Lokal ansehen

Wegen `fetch()` sollte die Seite über einen kleinen Webserver geöffnet werden:

```bash
python3 -m http.server 8000
```

Danach `http://localhost:8000` im Browser aufrufen.
