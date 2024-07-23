import React, { useState, useEffect, useCallback } from "react";

import { createStage, checkCollison } from '../gameHelpers';

// styled components
import { StyledTetrisWrapper, StyledTetris } from "./styles/StyledTetris";

// customed hooks
import { usePlayer } from "../hooks/usePlayer";
import { useStage } from "../hooks/useStage";

// components
import Stage from "./Stage";
import Display from "./Display";
import StartButton from "./StartButton";

const Tetris = () => {
    const [dropTime, setDropTime] = useState(1000); // Initial drop time (in milliseconds)
    const [gameOver, setGameOver] = useState(false);

    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage] = useStage(player);

    const movePlayer = dir => {
        if (!checkCollison(player, stage, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0 });
        }
    }

    const startGame = () => {
        // Reset everything
        setStage(createStage());
        resetPlayer();
        setGameOver(false);
        setDropTime(1000); // Set the drop time when the game starts
    }

    const drop = useCallback(() => {
        if (!checkCollison(player, stage, { x: 0, y: 1 })) {
            updatePlayerPos({ x: 0, y: 1, collided: false });
        } else {
            if (player.pos.y < 1) {
                console.log("GAME OVER!");
                setGameOver(true);
                setDropTime(null); // Stop the automatic dropping
            }
            updatePlayerPos({ x: 0, y: 0, collided: true });
        }
    }, [player, stage, updatePlayerPos]);

    const dropPlayer = () => {
        drop();
    }

    const move = ({ keyCode }) => {
        if (!gameOver) {
            if (keyCode === 37) {
                movePlayer(-1);
            } else if (keyCode === 39) {
                movePlayer(1);
            } else if (keyCode === 40) {
                dropPlayer();
            } else if (keyCode === 38) {
                playerRotate(stage, 1);
            }
        }
    }

    useEffect(() => {
        const handleDrop = () => {
            if (!gameOver) {
                drop();
            }
        };

        if (dropTime) {
            const dropInterval = setInterval(handleDrop, dropTime);
            return () => clearInterval(dropInterval);
        }
    }, [dropTime, gameOver, drop]);

    return (
        <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)}>
            <StyledTetris>
                <Stage stage={stage} />
                <aside>
                    {gameOver ? (
                        <Display gameOver={gameOver} text="Game Over" />
                    ) : (
                        <div>
                            <Display text="Score" />
                            <Display text="Rows" />
                            <Display text="Level" />
                        </div>
                    )}
                    <StartButton callback={startGame} />
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    );
};

export default Tetris;
