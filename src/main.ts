import { BrainsBrain, GoL, Seeds, WireWorld } from './automatons';
import { BoardState, IState } from './automatons/base';
import './style.css';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const $startBtn = document.getElementById('start') as HTMLButtonElement;
const $resetBtn = document.getElementById('reset') as HTMLButtonElement;
const $randomBtn = document.getElementById('random') as HTMLButtonElement;
const $nextBtn = document.getElementById('next') as HTMLButtonElement;
const $stateInput = document.getElementById('state') as HTMLInputElement;

const $automatonsSelect = document.getElementById(
	'automatons'
) as HTMLSelectElement;

const rows = canvas.width / 10;
const cols = canvas.height / 10;

let currentGame: IState = new GoL();
let currentState = 1;

const drawGrid = (
	gameState: BoardState,
	cellSize: number = 10,
	color = '#3a3a3a',
	fill = '#ffffff'
) => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = color;
	ctx.fillStyle = fill;
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			const x = i * cellSize;
			const y = j * cellSize;
			ctx.fillStyle = currentGame.colors[gameState[i][j]];
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

let gameState: BoardState = createBlankState(rows, cols);
drawGrid(gameState);

const getNeighborsCells = (
	gameState: BoardState,
	x: number,
	y: number
): Array<number> => {
	let num = new Array<number>(currentGame.totalState);
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

const getNextState = (gameState: BoardState): BoardState => {
	const newState: BoardState = [...gameState];

	for (let i = 0; i < rows; i++) {
		newState[i] = [];
		for (let j = 0; j < cols; j++) {
			let numNeighbors = getNeighborsCells(gameState, i, j);
			newState[i][j] = currentGame.getCellState(gameState[i][j], numNeighbors);
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

function fillClick(gameState: BoardState, x: number, y: number) {
	const height = canvas.clientHeight;
	const width = canvas.clientWidth;

	const rX = Math.floor((x / width) * gameState[0].length);
	const rY = Math.floor((y / height) * gameState.length);

	gameState[rX][rY] = currentState;
	drawGrid(gameState);
}

canvas.addEventListener('pointerdown', (e) => {
	isDrawing = true;
	stopAnimation();
	fillClick(gameState, e.offsetX, e.offsetY);
});

canvas.addEventListener('pointermove', (e) => {
	if (!isDrawing) return;
	fillClick(gameState, e.offsetX, e.offsetY);
});

document.addEventListener('pointerup', () => {
	isDrawing = false;
});

$startBtn.addEventListener('click', () => {
	if (!isRunning) startAnimation();
	else stopAnimation();
});

$nextBtn.addEventListener('click', () => {
	gameState = getNextState(gameState);
	drawGrid(gameState);
});

$resetBtn.addEventListener('click', () => {
	stopAnimation();
	gameState = createBlankState(rows, cols);
	drawGrid(gameState);
});

$randomBtn.addEventListener('click', () => {
	stopAnimation();
	gameState = createRandomState(rows, cols);
	drawGrid(gameState);
});

$automatonsSelect.addEventListener('change', () => {
	switch ($automatonsSelect.value) {
		case 'gol':
			currentGame = new GoL();
			break;
		case 'seeds':
			currentGame = new Seeds();
			break;
		case 'bb':
			currentGame = new BrainsBrain();
			break;

		case 'wire':
			currentGame = new WireWorld();
			break;
	}
});

$stateInput.addEventListener('change', () => {
	currentState = Number($stateInput.value);
});

function startAnimation() {
	if (isRunning) return;
	idLoop = window.requestAnimationFrame(loop);
	isRunning = true;
	$startBtn.textContent = 'Stop';
}

function stopAnimation() {
	window.cancelAnimationFrame(idLoop);
	isRunning = false;
	$startBtn.textContent = 'Start';
}
