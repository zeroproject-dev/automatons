import './style.css';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const $startBtn = document.getElementById('start') as HTMLButtonElement;
const $stopBtn = document.getElementById('stop') as HTMLButtonElement;
const $resetBtn = document.getElementById('reset') as HTMLButtonElement;
const $randomBtn = document.getElementById('random') as HTMLButtonElement;
const $nextBtn = document.getElementById('next') as HTMLButtonElement;

const rows = canvas.width / 10;
const cols = canvas.height / 10;

type GameState = Array<Array<number>>;

const drawGrid = (
	gameState: GameState,
	cellSize: number = 10,
	color = '#3a3a3a',
	fill = '#ffffff'
) => {
	ctx.strokeStyle = color;
	ctx.fillStyle = fill;
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			const x = i * cellSize;
			const y = j * cellSize;
			if (gameState[i][j] === 1) ctx.fillRect(x, y, cellSize, cellSize);
			ctx.strokeRect(x, y, cellSize, cellSize);
		}
	}
};

const createRandomState = (rows: number, cols: number) => {
	const arr = new Array(rows);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(cols);
		for (let j = 0; j < arr[i].length; j++) {
			arr[i][j] = Math.round(Math.random());
		}
	}
	return arr;
};

const createBlankState = (rows: number, cols: number) => {
	const arr = new Array(rows);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(cols);
		for (let j = 0; j < arr[i].length; j++) {
			arr[i][j] = 0;
		}
	}
	return arr;
};

let gameState: GameState = createBlankState(rows, cols);
drawGrid(gameState);

const getNeighborsCells = (gameState: GameState, x: number, y: number) => {
	let num = 0;
	for (let k = -1; k < 2; k++) {
		for (let l = -1; l < 2; l++) {
			try {
				num += gameState[x + k][y + l];
			} catch {
				num += 0;
			}
		}
	}
	num -= gameState[x][y];
	return num;
};

const getNextState = (gameState: GameState): GameState => {
	const newState: GameState = [...gameState];

	for (let i = 0; i < rows; i++) {
		newState[i] = [];
		for (let j = 0; j < cols; j++) {
			const cell = gameState[i][j];
			let numNeighbors = getNeighborsCells(gameState, i, j);

			if (cell === 0 && numNeighbors === 3) {
				newState[i][j] = 1;
			} else if (cell === 1 && (numNeighbors < 2 || numNeighbors > 3)) {
				newState[i][j] = 0;
			} else {
				newState[i][j] = cell;
			}
		}
	}

	return newState;
};

const loop = () => {
	if (!isRunning) return;
	gameState = getNextState(gameState);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGrid(gameState);

	return setTimeout(() => {
		requestAnimationFrame(loop);
	}, 100);
};

let idLoop: number;
let isRunning = false;

let isDrawing = false;

function fillClick(gameState: GameState, x: number, y: number) {
	const height = canvas.clientHeight;
	const width = canvas.clientWidth;

	const rX = Math.floor((x / width) * gameState[0].length);
	const rY = Math.floor((y / height) * gameState.length);

	gameState[rX][rY] = 1;
	drawGrid(gameState);
}

canvas.addEventListener('mousedown', (e) => {
	isDrawing = true;
	isRunning = false;
	fillClick(gameState, e.offsetX, e.offsetY);
});

canvas.addEventListener('mousemove', (e) => {
	if (!isDrawing) return;
	fillClick(gameState, e.offsetX, e.offsetY);
});

document.addEventListener('mouseup', () => {
	isDrawing = false;
});

$startBtn.addEventListener('click', startAnimation);

$stopBtn.addEventListener('click', stopAnimation);

$nextBtn.addEventListener('click', () => {
	gameState = getNextState(gameState);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGrid(gameState);
});

$resetBtn.addEventListener('click', () => {
	stopAnimation();
	gameState = createBlankState(rows, cols);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGrid(gameState);
});

$randomBtn.addEventListener('click', () => {
	stopAnimation();
	gameState = createRandomState(rows, cols);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGrid(gameState);
});

function startAnimation() {
	if (isRunning) return;
	idLoop = window.requestAnimationFrame(loop);
	isRunning = true;
}

function stopAnimation() {
	window.cancelAnimationFrame(idLoop);
	isRunning = false;
}
