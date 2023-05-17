import { IState, Neighbors } from './base';

export class GoL implements IState {
	colors: string[] = ['#242424', '#ffffff'];
	totalState: number = 2;

	getCellState(cell: number, neighbors: Neighbors): number {
		const DEAD = 0,
			LIVE = 1;
		if (cell === LIVE && (neighbors[LIVE] === 2 || neighbors[LIVE] === 3))
			return LIVE;
		if (cell === DEAD && neighbors[LIVE] === 3) return LIVE;
		return DEAD;
	}
}
