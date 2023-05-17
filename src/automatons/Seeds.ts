import { IState, Neighbors } from './base';

export class Seeds implements IState {
	colors: string[] = ['#242424', '#ffffff'];
	totalState: number = this.colors.length;

	getCellState(_cell: number, neighbors: Neighbors): number {
		if (neighbors[1] == 2) return 1;
		return 0;
	}
}
