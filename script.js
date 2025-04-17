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

// Event Listeners
startGameButton.addEventListener('click', startGame);
gotItButton.addEventListener('click', showGamePlay);
addPlayerButton.addEventListener('click', addPlayer);
revealAnswerButton.addEventListener('click', revealAnswer);
playAgainButton.addEventListener('click', resetGame);

// Initialize the game
function init() {
    document.documentElement.style.setProperty('--grid-size', GRID_SIZE);
    resetGame();
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
            
            // Add coordinates label
            if (gridElement === resultGrid) {
                const label = document.createElement('div');
                label.classList.add('grid-label');
                label.textContent = `${COLUMN_LABELS[col]}${row + 1}`;
                cell.appendChild(label);
                
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

// Color interpolation function (using HSL)
function interpolateColor(normalizedRow, normalizedCol) {
    // Convert hex colors to HSL
    const startColor = hexToHSL(currentColorPair.start);
    const endColor = hexToHSL(currentColorPair.end);
    
    // Simple linear interpolation between the colors
    // Using diagonal interpolation (normalizedRow + normalizedCol) / 2
    const t = (normalizedRow + normalizedCol) / 2;
    
    // Interpolate HSL values
    const h = startColor.h + (endColor.h - startColor.h) * t;
    const s = startColor.s + (endColor.s - startColor.s) * t;
    const l = startColor.l + (endColor.l - startColor.l) * t;
    
    return `hsl(${h}, ${s}%, ${l}%)`;
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