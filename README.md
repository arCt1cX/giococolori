# Gioco dei Colori

Un gioco per dispositivi mobili per 3+ giocatori su un singolo telefono. I giocatori cercano di ricordare e indovinare un colore da una griglia 5x5.

## Come Giocare

1. **Inizia il Gioco**: Il primo giocatore inizia il gioco e gli viene mostrata una cella segreta (come "C3").
2. **Ricorda la Cella**: Questo giocatore deve memorizzare le coordinate e poi premere "Ho Capito!".
3. **Mostra la Griglia**: Ora tutti i giocatori possono vedere la griglia completa con il suo gradiente di colori.
4. **Fai le Ipotesi**: Gli altri giocatori inseriscono le loro ipotesi per la cella target usando il sistema di coordinate.
5. **Rivela la Risposta**: Dopo che tutti i giocatori hanno inviato le loro ipotesi, premi "Rivela Risposta".
6. **Vedi i Risultati**: L'app mostra quali giocatori hanno indovinato correttamente e evidenzia la cella target.

## Caratteristiche

- Design responsive che funziona bene su dispositivi mobili
- Gradienti di colori casuali per varietà visiva
- Supporto per più giocatori
- Interfaccia semplice e intuitiva
- Tema scuro per una visualizzazione confortevole

## Dettagli Tecnici

Questa app è costruita con HTML, CSS e JavaScript puro senza framework o librerie.

### Griglia di Colori

- Una griglia 5x5 di colori formata interpolando dolcemente tra colori naturali
- I colori sono interpolati usando HSL per gradienti visivamente piacevoli
- La dimensione della griglia può essere facilmente modificata cambiando la costante `GRID_SIZE` nel file JavaScript

### Colori Naturali

I colori sono definiti nell'array `NATURAL_COLOR_BASES` nel file JavaScript. Per aggiungere più combinazioni di colori:

```javascript
const NATURAL_COLOR_BASES = [
    { hue: 0, name: "Rosso" },        // Rosso (mele, fragole)
    { hue: 30, name: "Arancione" },   // Arancione (arance, zucche)
    // Aggiungi altri colori qui
];
```

## Come Eseguire

Semplicemente apri il file `index.html` in qualsiasi browser moderno. Nessun server o installazione richiesta.

## Compatibilità Browser

Questa app funziona in tutti i browser moderni, inclusi:
- Chrome
- Firefox
- Safari
- Edge 