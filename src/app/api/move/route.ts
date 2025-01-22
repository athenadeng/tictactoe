import { NextResponse } from 'next/server';
import type { Cell, Board, AIType } from '@/lib/ai/types';

function findBestMove(board: Board, aiType: AIType): number {
  // greedy implementation --> integrate ai algos later
  return board.findIndex(cell => cell === null);
}

export async function POST(request: Request) {
  try {
    const { board, aiType } = await request.json();
    
    const position = findBestMove(board, aiType);
    
    return NextResponse.json({ position });
  } 
  catch (error) {
    return NextResponse.json(
      { error: 'Failed to calculate move' },
      { status: 500 }
    );
  }
}