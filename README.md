# Color Grid Game

A mobile-friendly party game for 3+ players on a single phone. Players try to remember and guess a color from a 5x5 gradient grid.

## How to Play

1. **Start the Game**: The first player starts the game and is shown a secret target cell (like "C3").
2. **Remember the Cell**: This player should memorize the coordinates and then press "Got It!".
3. **Show the Grid**: Now all players can see the full color grid with its smooth gradient.
4. **Make Guesses**: Other players enter their guesses for the target cell using the coordinate system.
5. **Reveal the Answer**: After all players have submitted their guesses, press "Reveal Answer".
6. **See Results**: The app shows which players guessed correctly and highlights the target cell.

## Features

- Responsive design that works well on mobile devices
- Random color gradients for visual variety
- Multiple player support
- Simple and intuitive interface
- Dark theme for comfortable viewing

## Technical Details

This app is built with pure HTML, CSS, and JavaScript without any frameworks or libraries.

### Color Grid

- A 5x5 grid of colors formed by smoothly interpolating between two random colors
- Colors are interpolated using HSL for more visually pleasing gradients
- Grid size can be easily modified by changing the `GRID_SIZE` constant in the JavaScript file

### Color Pairs

Color pairs are defined in the `colorPairs` array in the JavaScript file. To add more color combinations:

```javascript
let colorPairs = [
    { start: '#e74c3c', end: '#3498db' },    // Red to Blue
    { start: '#2ecc71', end: '#f39c12' },    // Green to Orange
    // Add more color pairs here
];
```

## How to Run

Simply open the `index.html` file in any modern web browser. No server or installation required.

## Browser Compatibility

This app works in all modern browsers, including:
- Chrome
- Firefox
- Safari
- Edge 