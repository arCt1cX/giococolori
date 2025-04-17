// Game variables
const GRID_SIZE = 5;
const COLUMN_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
let targetCell = null;
let colorPairs = [
    { start: '#e74c3c', end: '#3498db' },    // Red to Blue
    { start: '#2ecc71', end: '#f39c12' },    // Green to Orange
    { start: '#ff6b81', end: '#fdcb6e' },    // Pink to Yellow
    { start: '#9b59b6', end: '#1abc9c' },    // Purple to Cyan
    { start: '#f368e0', end: '#00d2d3' },    // Bright Pink to Teal
    { start: '#6c5ce7', end: '#feca57' }     // Indigo to Mustard
];
let currentColorPair = null;
let players = [];

// DOM Elements
const gameSetupSection = document.getElementById('game-setup');
const targetRevealSection = document.getElementById('target-reveal');
const gamePlaySection = document.getElementById('game-play');
const gameResultSection = document.getElementById('game-result');
const startGameButton = document.getElementById('start-game');
const gotItButton = document.getElementById('got-it');
const addPlayerButton = document.getElementById('add-player');
const revealAnswerButton = document.getElementById('reveal-answer');
const playAgainButton = document.getElementById('play-again');
const colorGrid = document.getElementById('color-grid');
const resultGrid = document.getElementById('result-grid');
const playerInputsArea = document.getElementById('player-inputs');
const resultsList = document.getElementById('results-list');
const targetCellDisplay = document.getElementById('target-cell');
const targetCoordsDisplay = document.getElementById('target-coords');

// Get all grid label containers
const gridLabelsRows = document.querySelectorAll('.grid-labels-row');
const gridLabelsCols = document.querySelectorAll('.grid-labels-col');

// Event Listeners
startGameButton.addEventListener('click', startGame);
gotItButton.addEventListener('click', showGamePlay);
addPlayerButton.addEventListener('click', addPlayer);
revealAnswerButton.addEventListener('click', revealAnswer);
playAgainButton.addEventListener('click', resetGame);

// Initialize the game
function init() {
    document.documentElement.style.setProperty('--grid-size', GRID_SIZE);
    
    // Update grid labels based on GRID_SIZE
    updateGridLabels();
    
    resetGame();
}

// Update grid coordinate labels based on grid size
function updateGridLabels() {
    // Update column labels (A, B, C, ...)
    gridLabelsRows.forEach(container => {
        // Clear existing labels except the empty corner
        const emptyCorner = container.querySelector('.empty-corner');
        container.innerHTML = '';
        container.appendChild(emptyCorner);
        
        // Add column labels
        for (let i = 0; i < GRID_SIZE; i++) {
            const label = document.createElement('div');
            label.classList.add('col-label');
            label.textContent = COLUMN_LABELS[i];
            container.appendChild(label);
        }
    });
    
    // Update row labels (1, 2, 3, ...)
    gridLabelsCols.forEach(container => {
        container.innerHTML = '';
        
        // Add row labels
        for (let i = 0; i < GRID_SIZE; i++) {
            const label = document.createElement('div');
            label.classList.add('row-label');
            label.textContent = i + 1;
            container.appendChild(label);
        }
    });
}

// Start the game
function startGame() {
    // Pick a random color pair
    currentColorPair = colorPairs[Math.floor(Math.random() * colorPairs.length)];
    
    // Generate and show the target cell
    targetCell = {
        row: Math.floor(Math.random() * GRID_SIZE),
        col: Math.floor(Math.random() * GRID_SIZE)
    };
    
    // Update the target reveal screen
    const cellCoords = `${COLUMN_LABELS[targetCell.col]}${targetCell.row + 1}`;
    targetCoordsDisplay.textContent = cellCoords;
    
    // Set the target cell color
    const cellColor = interpolateColor(
        targetCell.row / (GRID_SIZE - 1),
        targetCell.col / (GRID_SIZE - 1)
    );
    targetCellDisplay.style.backgroundColor = cellColor;
    
    // Hide setup screen, show target reveal
    gameSetupSection.classList.add('hidden');
    targetRevealSection.classList.remove('hidden');
}

// Show the game play screen with full grid
function showGamePlay() {
    // Hide target reveal, show game play
    targetRevealSection.classList.add('hidden');
    gamePlaySection.classList.remove('hidden');
    
    // Clear any previous players
    players = [];
    playerInputsArea.innerHTML = '';
    
    // Generate the full color grid
    generateColorGrid(colorGrid);
    
    // Add two players by default
    addPlayer();
    addPlayer();
}

// Generate the color grid
function generateColorGrid(gridElement) {
    gridElement.innerHTML = '';
    
    // Create cells
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            
            // Normalize positions to 0-1 range for interpolation
            const normalizedRow = row / (GRID_SIZE - 1);
            const normalizedCol = col / (GRID_SIZE - 1);
            
            // Set the color using interpolation
            const cellColor = interpolateColor(normalizedRow, normalizedCol);
            cell.style.backgroundColor = cellColor;
            
            // Add coordinates label for the results grid only
            if (gridElement === resultGrid) {
                // Highlight the target cell in the results grid
                if (row === targetCell.row && col === targetCell.col) {
                    cell.classList.add('target');
                }
            }
            
            gridElement.appendChild(cell);
        }
    }
}

// Add a new player input
function addPlayer() {
    const playerNumber = players.length + 1;
    const playerName = `Player ${playerNumber}`;
    
    players.push({
        name: playerName,
        guess: null
    });
    
    const playerDiv = document.createElement('div');
    playerDiv.classList.add('player-input');
    
    const label = document.createElement('label');
    label.textContent = `${playerName}: `;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'B3';
    input.setAttribute('data-player', playerNumber - 1);
    input.maxLength = 2;
    input.addEventListener('change', function() {
        const playerIndex = parseInt(this.getAttribute('data-player'));
        players[playerIndex].guess = this.value.toUpperCase();
    });
    
    playerDiv.appendChild(label);
    playerDiv.appendChild(input);
    playerInputsArea.appendChild(playerDiv);
}

// Reveal the answer and show results
function revealAnswer() {
    // Generate result grid with coordinates
    generateColorGrid(resultGrid);
    
    // Show results for each player
    resultsList.innerHTML = '';
    const targetCoords = `${COLUMN_LABELS[targetCell.col]}${targetCell.row + 1}`;
    
    players.forEach(player => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('results-item');
        
        if (player.guess === targetCoords) {
            resultItem.classList.add('correct');
            resultItem.textContent = `${player.name}: Correct! (${player.guess})`;
        } else {
            resultItem.classList.add('incorrect');
            resultItem.textContent = `${player.name}: Wrong! Guessed ${player.guess || 'nothing'}`;
        }
        
        resultsList.appendChild(resultItem);
    });
    
    // Hide game play, show results
    gamePlaySection.classList.add('hidden');
    gameResultSection.classList.remove('hidden');
}

// Reset the game to initial state
function resetGame() {
    gameResultSection.classList.add('hidden');
    gameSetupSection.classList.remove('hidden');
}

// Clean gradient interpolation function
function interpolateColor(normalizedRow, normalizedCol) {
    // Create four corner colors for the grid
    // We'll derive these from the original color pair to maintain the theme
    const startColor = hexToHSL(currentColorPair.start);
    const endColor = hexToHSL(currentColorPair.end);
    
    // Calculate color for top-left corner (will be the start color)
    const topLeft = {
        h: startColor.h,
        s: startColor.s,
        l: startColor.l
    };
    
    // Calculate color for top-right corner (same hue family as start, different saturation/lightness)
    const topRight = {
        h: startColor.h,
        s: Math.min(100, startColor.s + 15),
        l: Math.min(80, startColor.l + 10)
    };
    
    // Calculate color for bottom-left corner (transitioning toward end color)
    const bottomLeft = {
        h: endColor.h,
        s: Math.min(100, endColor.s - 5),
        l: Math.max(30, endColor.l - 15)
    };
    
    // Calculate color for bottom-right corner (will be the end color)
    const bottomRight = {
        h: endColor.h,
        s: endColor.s,
        l: endColor.l
    };
    
    // Bilinear interpolation between the four corners
    // First interpolate the top edge
    const topColor = {
        h: interpolateHue(topLeft.h, topRight.h, normalizedCol),
        s: lerp(topLeft.s, topRight.s, normalizedCol),
        l: lerp(topLeft.l, topRight.l, normalizedCol)
    };
    
    // Interpolate the bottom edge
    const bottomColor = {
        h: interpolateHue(bottomLeft.h, bottomRight.h, normalizedCol),
        s: lerp(bottomLeft.s, bottomRight.s, normalizedCol),
        l: lerp(bottomLeft.l, bottomRight.l, normalizedCol)
    };
    
    // Finally, interpolate between top and bottom
    return `hsl(${interpolateHue(topColor.h, bottomColor.h, normalizedRow)}, 
              ${lerp(topColor.s, bottomColor.s, normalizedRow)}%, 
              ${lerp(topColor.l, bottomColor.l, normalizedRow)}%)`;
}

// Helper function for linear interpolation
function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Helper function to interpolate hue values (handles the circular nature of hue)
function interpolateHue(h1, h2, t) {
    // Ensure both hues are in the same range
    const hue1 = (h1 + 360) % 360;
    const hue2 = (h2 + 360) % 360;
    
    // Find the shortest path around the color wheel
    let delta = hue2 - hue1;
    if (Math.abs(delta) > 180) {
        delta = delta > 0 ? delta - 360 : delta + 360;
    }
    
    // Calculate the interpolated hue
    let result = (hue1 + delta * t) % 360;
    if (result < 0) result += 360;
    
    return result;
}

// Convert hex color to HSL
function hexToHSL(hex) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        h *= 60;
    }
    
    return { h, s: s * 100, l: l * 100 };
}

// Initialize the game on load
window.addEventListener('DOMContentLoaded', init); 