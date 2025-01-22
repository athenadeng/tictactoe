'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cell, Board, AIType } from '@/lib/ai/types';

const TicTacToe = () => {
    const [board, setBoard] = useState<Board>(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState<Cell>('X');
    const [selectedAI, setSelectedAI] = useState('minimax');
    const [isGameOver, setIsGameOver] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);

    // all agent types --> add more later?
    const aiAgents = [
        { value: 'minimax', label: 'Minimax (Optimal)' },
        { value: 'alphabeta', label: 'Alpha-Beta (Faster Optimal)' },
        { value: 'ids', label: 'Iterative Deepening Search' },
        { value: 'mcts', label: 'Monte Carlo Tree Search' },
    ];

    // agent's turn
    const requestAgentMove = async (currentBoard: Board) => {
        setIsWaiting(true);
        try {
            const response = await fetch('/api/move', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    board: currentBoard,
                    aiType: selectedAI,
                }),
            });
        if (!response.ok) throw new Error("Failed to get agent's move");
        
        const { square } = await response.json();
        makeMove(square);
        } 
        catch (error) {
            console.error("Error getting agent's move:", error);
        }
        finally {
            setIsWaiting(false);
        }
    };

    // checks if there is a winner
    const checkWinner = (boardState: Board) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];
        
        // check for completed lines
        for (const [a, b, c] of lines) {
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                return boardState[a];
            }
        }

        if (boardState.every(cell => cell !== null)) {
            return 'draw';
        }

        return null;
    };

    // make a move
    const makeMove = (square: number) => {
        if (board[square] || isGameOver || isWaiting) return; // can't make move

        const newBoard: Board = [...board]; // new state
        newBoard[square] = currentPlayer;
        setBoard(newBoard);

        const winner = checkWinner(newBoard);
        if (winner) {
            setIsGameOver(true);
            return;
        }

        if (currentPlayer === 'X') {
            setCurrentPlayer('O');
            requestAgentMove(newBoard);
        } 
        else {
            setCurrentPlayer('X');
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setCurrentPlayer('X');
        setIsGameOver(false);
        setIsWaiting(false);
    };

    return (
        <Card className="w-96">
            <CardHeader>
                <CardTitle>Tic Tac Toe vs AI</CardTitle>
                <Select value={selectedAI} onValueChange={setSelectedAI}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select AI Opponent" />
                    </SelectTrigger>
                    <SelectContent>
                        {aiAgents.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-2">
                    {board.map((cell, index) => (
                        <Button
                        key={index}
                        onClick={() => makeMove(index)}
                        variant={cell ? 'default' : 'outline'}
                        className="h-20 text-2xl font-bold"
                        disabled={isWaiting || isGameOver || cell !== null}
                        >
                        {cell}
                        </Button>
                    ))}
                </div>
                <div className="mt-4 text-center">
                    {isGameOver && (
                        <div className="mb-4">
                        {checkWinner(board) === 'draw' ? 
                            <p className="text-lg font-semibold">Game Over - It's a draw!</p> :
                            <p className="text-lg font-semibold">Winner: {checkWinner(board)}</p>
                        }
                        </div>
                    )}
                    <Button 
                        onClick={resetGame}
                        className="mt-2"
                        variant="outline"
                    >
                        Reset Game
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default TicTacToe;