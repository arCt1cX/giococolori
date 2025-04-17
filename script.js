// Game variables
const GRID_SIZE = 5;
const COLUMN_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
let targetCell = null;
let colorSets = [
    { topLeft: '#e74c3c', topRight: '#3498db', bottomLeft: '#2ecc71', bottomRight: '#f39c12' },    // Red, Blue, Green, Orange
    { topLeft: '#9b59b6', topRight: '#1abc9c', bottomLeft: '#f368e0', bottomRight: '#feca57' },    // Purple, Cyan, Pink, Yellow
    { topLeft: '#6c5ce7', topRight: '#00d2d3', bottomLeft: '#fd79a8', bottomRight: '#fdcb6e' },    // Indigo, Teal, Pink, Light Yellow
    { topLeft: '#c0392b', topRight: '#8e44ad', bottomLeft: '#16a085', bottomRight: '#f1c40f' },    // Dark Red, Purple, Teal, Yellow
    { topLeft: '#ff6b6b', topRight: '#48dbfb', bottomLeft: '#1dd1a1', bottomRight: '#feca57' },    // Light Red, Light Blue, Mint, Light Orange
    { topLeft: '#5f27cd', topRight: '#ff9ff3', bottomLeft: '#1b9cfc', bottomRight: '#ff6b6b' }     // Dark Purple, Light Pink, Blue, Red
];
let currentColorSet = null;
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
    // Pick a random color set
    currentColorSet = colorSets[Math.floor(Math.random() * colorSets.length)];
    
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
    
    // Add row labels container (for numbers 1-5)
    if (gridElement === colorGrid || gridElement === resultGrid) {
        const rowLabelsContainer = document.createElement('div');
        rowLabelsContainer.classList.add('row-labels');
        
        // Add empty cell for top-left corner
        const emptyCorner = document.createElement('div');
        emptyCorner.classList.add('corner-label');
        rowLabelsContainer.appendChild(emptyCorner);
        
        // Add column labels (A-E)
        for (let col = 0; col < GRID_SIZE; col++) {
            const colLabel = document.createElement('div');
            colLabel.classList.add('col-label');
            colLabel.textContent = COLUMN_LABELS[col];
            rowLabelsContainer.appendChild(colLabel);
        }
        
        gridElement.appendChild(rowLabelsContainer);
    }
    
    // Create grid with row labels
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container');
    
    // Add row labels
    if (gridElement === colorGrid || gridElement === resultGrid) {
        const rowLabelsCol = document.createElement('div');
        rowLabelsCol.classList.add('row-labels-column');
        
        for (let row = 0; row < GRID_SIZE; row++) {
            const rowLabel = document.createElement('div');
            rowLabel.classList.add('row-label');
            rowLabel.textContent = row + 1;
            rowLabelsCol.appendChild(rowLabel);
        }
        
        gridContainer.appendChild(rowLabelsCol);
    }
    
    // Create the actual color grid
    const actualGrid = document.createElement('div');
    actualGrid.classList.add('actual-grid');
    
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
            
            // Add coordinates label on the result grid
            if (gridElement === resultGrid) {
                // Highlight the target cell in the results grid
                if (row === targetCell.row && col === targetCell.col) {
                    cell.classList.add('target');
                }
            }
            
            actualGrid.appendChild(cell);
        }
    }
    
    gridContainer.appendChild(actualGrid);
    gridElement.appendChild(gridContainer);
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

// Color interpolation function (using four corners)
function interpolateColor(normalizedRow, normalizedCol) {
    // Get the four corner colors
    const topLeft = hexToRGB(currentColorSet.topLeft);
    const topRight = hexToRGB(currentColorSet.topRight);
    const bottomLeft = hexToRGB(currentColorSet.bottomLeft);
    const bottomRight = hexToRGB(currentColorSet.bottomRight);
    
    // Bilinear interpolation
    // First interpolate the top colors based on column
    const topColor = {
        r: topLeft.r + (topRight.r - topLeft.r) * normalizedCol,
        g: topLeft.g + (topRight.g - topLeft.g) * normalizedCol,
        b: topLeft.b + (topRight.b - topLeft.b) * normalizedCol
    };
    
    // Then interpolate the bottom colors based on column
    const bottomColor = {
        r: bottomLeft.r + (bottomRight.r - bottomLeft.r) * normalizedCol,
        g: bottomLeft.g + (bottomRight.g - bottomLeft.g) * normalizedCol,
        b: bottomLeft.b + (bottomRight.b - bottomLeft.b) * normalizedCol
    };
    
    // Finally, interpolate between top and bottom based on row
    const finalColor = {
        r: Math.round(topColor.r + (bottomColor.r - topColor.r) * normalizedRow),
        g: Math.round(topColor.g + (bottomColor.g - topColor.g) * normalizedRow),
        b: Math.round(topColor.b + (bottomColor.b - topColor.b) * normalizedRow)
    };
    
    return `rgb(${finalColor.r}, ${finalColor.g}, ${finalColor.b})`;
}

// Convert hex color to RGB
function hexToRGB(hex) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
}

// Initialize the game on load
window.addEventListener('DOMContentLoaded', init); 