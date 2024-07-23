import { useState, useEffect } from "react";
import { createStage } from '../gameHelpers';

export const useStage = (player, resetPlayer) => {
    const [stage, setStage] = useState(createStage());
    const [rowsCleared, setRowsCleared] = useState(0);

    useEffect(() => {
        // Reset rowsCleared when player changes
        setRowsCleared(0);

        const sweepRows = newStage =>
            newStage.reduce((ack, row) => {
                if (row.every(cell => cell[0] !== 0)) {
                    setRowsCleared(prev => prev + 1);
                    ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
                    return ack;
                }
                ack.push(row);
                return ack;
            }, []);

        const updateStage = prevStage => {
            // Create a new stage array with the same dimensions
            const newStage = prevStage.map(row =>
                row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell)),
            );

            // Draw the tetromino on the stage
            player.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        const newY = y + player.pos.y;
                        const newX = x + player.pos.x;

                        // Ensure we are not going out of bounds
                        if (newY >= 0 && newY < newStage.length && newX >= 0 && newX < newStage[0].length) {
                            newStage[newY][newX] = [
                                value,
                                `${player.collided ? 'merged' : 'clear'}`,
                            ];
                        }
                    }
                });
            });

            // Check if player has collided and handle row clearing
            if (player.collided) {
                resetPlayer();
                return sweepRows(newStage);
            }

            return newStage;
        };

        setStage(prev => updateStage(prev));
    }, [player, resetPlayer]);

    return [stage, setStage, rowsCleared];
};
