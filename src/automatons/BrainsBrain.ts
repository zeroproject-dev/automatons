import { IState, Neighbors } from './base';

export class BrainsBrain implements IState {
	colors: string[] = ['#242424', '#ffffff', '#3333ff'];
	totalState: number = this.colors.length;

	getCellState(cell: number, neighbors: Neighbors): number {
		const DEAD = 0,
			LIVE = 1,
			DYING = 2;
		if (cell === DEAD && neighbors[LIVE] === 2) return LIVE;
		if (cell === LIVE) return DYING;
		return DEAD;
	}
}
