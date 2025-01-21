export type Cell = 'X' | 'O' | null;
export type Board = Cell[];
export type AIType = 'minimax' | 'alphabeta' | 'ids' | 'mcts';

export interface Move {
    position: number;
    evaluation?: number;
}