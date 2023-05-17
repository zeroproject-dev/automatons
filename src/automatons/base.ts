export type BoardState = Array<Array<number>>;
export type Neighbors = Array<number>;

export interface IState {
	colors: Array<string>;
	totalState: number;
	getCellState(cell: number, neighbors: Neighbors): number;
}
