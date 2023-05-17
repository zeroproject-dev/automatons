import { IState, Neighbors } from './base';

export class WireWorld implements IState {
	colors: string[] = ['#242424', '#4326cf', '#ff4000', '#ffff00'];
	totalState: number = this.colors.length;

	getCellState(cell: number, neighbors: Neighbors): number {
		const EMPTY = 0,
			ELECTRON_HEAD = 1,
			ELECTRON_TAIL = 2,
			CONDUCTOR = 3;
		if (cell === EMPTY) return EMPTY;
		if (cell === ELECTRON_HEAD) return ELECTRON_TAIL;
		if (cell === ELECTRON_TAIL) return CONDUCTOR;
		if (
			cell === CONDUCTOR &&
			(neighbors[ELECTRON_HEAD] === 1 || neighbors[ELECTRON_HEAD] === 2)
		)
			return ELECTRON_HEAD;
		else return CONDUCTOR;
	}
}
