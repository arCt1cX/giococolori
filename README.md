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
- Four-corner color gradients for visual variety and challenge
- Coordinate labels on rows and columns for easier cell identification
- Multiple player support
- Simple and intuitive interface
- Dark theme for comfortable viewing

## Technical Details

This app is built with pure HTML, CSS, and JavaScript without any frameworks or libraries.

### Color Grid

- A 5x5 grid of colors formed by smoothly interpolating between four different corner colors
- Colors use bilinear interpolation for smooth transitions
- Grid size can be easily modified by changing the `GRID_SIZE` constant in the JavaScript file
- Grid includes coordinate labels (A-E for columns, 1-5 for rows)

### Color Sets

Color sets are defined in the `colorSets` array in the JavaScript file. Each set defines colors for all four corners. To add more color combinations:

```javascript
let colorSets = [
    { topLeft: '#e74c3c', topRight: '#3498db', bottomLeft: '#2ecc71', bottomRight: '#f39c12' },
    { topLeft: '#9b59b6', topRight: '#1abc9c', bottomLeft: '#f368e0', bottomRight: '#feca57' },
    // Add more color sets here
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