export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

export const createStage = () =>
    Array.from(Array(STAGE_HEIGHT), () =>
        new Array(STAGE_WIDTH).fill([0, 'clear'])
)

export const checkCollison = (player, stage, { x: moveX, y: moveY }) => {
    for (let y = 0; y < player.tetromino.length; y += 1) {
        for (let x = 0; x < player.tetromino[0].length; x += 1) {
            // 1. Check that we're on an actual Tetromino cell
            if (player.tetromino[y][x] !== 0) {
                if (
                    // 2. Check that our movement is inside the game area's height (y)
                    !stage[y + player.pos.y + moveY] ||
                    // 3. Check that our move is inside the game area's width (x)
                    !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
                    // 4. Check that the cell we're moving to isn't set to clear
                    stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear'
                ) {
                    console.log("Collision detected:", {
                        pos: player.pos,
                        move: { x: moveX, y: moveY },
                        tetromino: player.tetromino,
                        stage
                    });
                    return true;
                }
            }
        }
    }
    return false;
};