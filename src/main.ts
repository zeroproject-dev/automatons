import './style.css';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const $startBtn = document.getElementById('start') as HTMLButtonElement;
const $stopBtn = document.getElementById('stop') as HTMLButtonElement;
const $resetBtn = document.getElementById('reset') as HTMLButtonElement;
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

const createInitialState = (rows: number, cols: number) => {
	const arr = new Array(rows);
	for (let i = 0; i < arr.length; i++) {
		if (i == 0 || i == arr.length - 1) {
			arr[i] = new Array(cols).fill(0);
			continue;
		}

		arr[i] = new Array(cols);
		for (let j = 0; j < arr[i].length; j++) {
			if (j == 0 || j == arr.length - 1) {
				arr[j] = new Array(cols).fill(0);
				continue;
			}
			arr[i][j] = Math.round(Math.random());
		}
	}
	return arr;
};

let gameState = createInitialState(rows, cols);
drawGrid(gameState);

const update = (gameState: GameState): GameState => {
	const newState: GameState = [...gameState];

	for (let i = 1; i < rows - 1; i++) {
		newState[i] = [];
		for (let j = 1; j < cols - 1; j++) {
			const cell = gameState[i][j];
			let numNeighbors = 0;

			for (let k = -1; k < 2; k++) {
				for (let l = -1; l < 2; l++) {
					numNeighbors += gameState[i + k][j + l];
				}
			}

			numNeighbors -= cell;

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
	gameState = update(gameState);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGrid(gameState);

	return setTimeout(() => {
		requestAnimationFrame(loop);
	}, 100);
};

let idLoop: number;
let isRunning = false;

$startBtn.addEventListener('click', () => {
	if (isRunning) return;
	idLoop = window.requestAnimationFrame(loop);
	isRunning = true;
});

$stopBtn.addEventListener('click', () => {
	window.cancelAnimationFrame(idLoop);
	isRunning = false;
});
