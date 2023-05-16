import './style.css';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const $startBtn = document.getElementById('start') as HTMLButtonElement;
const $stopBtn = document.getElementById('stop') as HTMLButtonElement;
const $resetBtn = document.getElementById('reset') as HTMLButtonElement;
const $randomBtn = document.getElementById('random') as HTMLButtonElement;
const $nextBtn = document.getElementById('next') as HTMLButtonElement;

const $automatonsSelect = document.getElementById(
	'automatons'
) as HTMLSelectElement;

const rows = canvas.width / 10;
const cols = canvas.height / 10;

type GameState = Array<Array<number>>;

const COLOR_STATES = ['#242424', '#ffffff', '#33ff33'];
let totalStates = 2;

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
			ctx.fillStyle = COLOR_STATES[gameState[i][j]];
			if (gameState[i][j] !== 0) ctx.fillRect(x, y, cellSize, cellSize);
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

const getNeighborsCells = (
	gameState: GameState,
	x: number,
	y: number,
	Ncount: number
): Array<number> => {
	let num = new Array<number>(Ncount);
	num.fill(0);

	for (let k = -1; k < 2; k++) {
		for (let l = -1; l < 2; l++) {
			try {
				if (k === 0 && l === 0) continue;
				num[gameState[x + k][y + l]]++;
			} catch {
				num[0]++;
			}
		}
	}

	return num;
};

const GoL = (cell: number, neighbors: Array<number>) => {
	if (cell === 1 && (neighbors[1] === 2 || neighbors[1] === 3)) return 1;
	if (cell === 0 && neighbors[1] === 3) return 1;
	return 0;
};

const Seeds = (_cell: number, neighbors: Array<number>) => {
	if (neighbors[1] == 2) return 1;
	return 0;
};

const BrainsBrain = (cell: number, neighbors: Array<number>) => {
	if (cell === 0 && neighbors[1] === 2) return 1;
	if (cell === 1) return 2;
	return 0;
};

let currentGame: Function = GoL;

const getNextState = (gameState: GameState): GameState => {
	const newState: GameState = [...gameState];

	for (let i = 0; i < rows; i++) {
		newState[i] = [];
		for (let j = 0; j < cols; j++) {
			let numNeighbors = getNeighborsCells(gameState, i, j, totalStates);
			newState[i][j] = currentGame(gameState[i][j], numNeighbors);
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

$automatonsSelect.addEventListener('change', () => {
	switch ($automatonsSelect.value) {
		case 'gol':
			totalStates = 2;
			currentGame = GoL;
			break;
		case 'seeds':
			totalStates = 2;
			currentGame = Seeds;
			break;
		case 'bb':
			totalStates = 3;
			currentGame = BrainsBrain;
			break;
	}
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
