export const basic = () => {
    return function(smallestMoves) {
        return smallestMoves[Math.floor(Math.random() * smallestMoves.length)];
    }
}

export const center = (width, height, extreme, dist) => {
    return function(smallestMoves) {
        let best = extreme === "to the farthest point" ? -1 : Number.MAX_VALUE;
        let bestMoves = [];
        let center = [(width - 1) / 2, (height - 1) / 2];
        for (let move of smallestMoves) {
            let squareDist = dist === "Euclidean" ?
                Math.pow(move[0] - center[0], 2) + Math.pow(move[1] - center[1], 2) :
                Math.abs(move[0] - center[0]) + Math.abs(move[1] - center[1]);
            if ((extreme === "to the farthest point" && squareDist > best) || squareDist < best) {
                best = squareDist;
                bestMoves = [move];
            } else if (squareDist === best) {
                bestMoves.push(move);
            }
        }
        return bestMoves[Math.floor(Math.random() * bestMoves.length)];
    }
}

export const mouse = (width, height, extreme, dist, mousePos) => {
    return function(smallestMoves) {
        let best = extreme === "to the farthest point" ? -1 : Number.MAX_VALUE;
        let bestMoves = [];
        for (let move of smallestMoves) {
            let squareDist = dist === "Euclidean" ?
                Math.pow(move[0] - mousePos[0], 2) + Math.pow(move[1] - mousePos[1], 2) :
                Math.abs(move[0] - mousePos[0]) + Math.abs(move[1] - mousePos[1]);
            if ((extreme === "to the farthest point" && squareDist > best) ||
                (extreme === "to the closest point" && squareDist < best)) {
                best = squareDist;
                bestMoves = [move];
            } else if (squareDist === best) {
                bestMoves.push(move);
            }
        }
        return bestMoves[Math.floor(Math.random() * bestMoves.length)];
    }
}