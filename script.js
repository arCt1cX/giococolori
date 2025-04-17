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

// Rainbow-style color interpolation
function interpolateColor(normalizedRow, normalizedCol) {
    // Start with the HSL values from the color pair
    const startColor = hexToHSL(currentColorPair.start);
    const endColor = hexToHSL(currentColorPair.end);
    
    // Calculate the total hue range (considering the possibility that we need to wrap around 360 degrees)
    let hueRange = endColor.h - startColor.h;
    if (Math.abs(hueRange) > 180) {
        // Take the shorter path around the hue circle
        hueRange = hueRange > 0 ? hueRange - 360 : hueRange + 360;
    }
    
    // Create unique hue for each position in the grid using a combination of row and column
    // We'll use a sine wave pattern to create smooth transitions that aren't linear
    const rowFactor = Math.sin(normalizedRow * Math.PI);
    const colFactor = Math.sin(normalizedCol * Math.PI);
    
    // Calculate base hue from the start, adjusting by position factors
    let hue = startColor.h + hueRange * (normalizedCol * 0.6 + normalizedRow * 0.4);
    
    // Apply a slight wave pattern to create more variation
    hue += 15 * Math.sin((normalizedRow + normalizedCol) * 3 * Math.PI);
    
    // Ensure hue stays within 0-360 range
    hue = (hue + 360) % 360;
    
    // Calculate saturation with slight variations
    const saturation = Math.max(20, Math.min(100, 
        startColor.s + (endColor.s - startColor.s) * normalizedCol + 
        5 * Math.sin(normalizedRow * 2 * Math.PI)
    ));
    
    // Calculate lightness based on both position with complementary patterns
    const lightness = Math.max(20, Math.min(80, 
        startColor.l + (endColor.l - startColor.l) * normalizedRow +
        8 * Math.sin((normalizedCol - normalizedRow) * 2 * Math.PI)
    ));
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
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