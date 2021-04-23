import TourBoard from './TourBoard';
import Button from "@material-ui/core/Button";
import React from "react";

export default class AutoBoard extends TourBoard {
    constructor(props) {
        super(props);
        this.state["showAccess"] = this.props.defaultAccess;
    }
    handleClick = () => {}
    handleStep = () => {
        if (this.state.traversed.length !== this.props.width * this.props.height - 1) {
            let moves = this.getValidMoves(this.state.knightPos);
            if (moves) {
                this.setState(prevState => ({
                    knightPos: this.chooseLeastAccess(moves),
                    traversed: [this.indexToInt(this.state.knightPos), ...prevState.traversed],
                }));
            }
        }
    }
    handleAccess = () => {
        this.setState(prevState => ({
            showAccess: !prevState.showAccess,
        }));
    }
    getValidMoves = (pos) => {
        let moves = [];
        moves.push([pos[0] - 2, pos[1] - 1]);
        moves.push([pos[0] + 2, pos[1] - 1]);
        moves.push([pos[0] - 2, pos[1] + 1]);
        moves.push([pos[0] + 2, pos[1] + 1]);
        moves.push([pos[0] - 1, pos[1] - 2]);
        moves.push([pos[0] + 1, pos[1] - 2]);
        moves.push([pos[0] - 1, pos[1] + 2]);
        moves.push([pos[0] + 1, pos[1] + 2]);
        for (let i = moves.length; i--;) {
            if (moves[i][0] < 0 || moves[i][0] >= this.props.width ||
                    moves[i][1] < 0 || moves[i][1] >= this.props.height ||
                    this.state.traversed.includes(this.indexToInt(moves[i])) ||
                    this.posEqual(this.state.knightPos, moves[i])) {
                moves.splice(i, 1);
            }
        }
        return moves;
    }
    chooseLeastAccess = (moves) => {
        let leastAccess = 8;
        let smallestMoves = [];
        for (let move of moves) {
            let moveAccess = this.getValidMoves(move).length;
            if (moveAccess < leastAccess) {
                leastAccess = moveAccess;
                smallestMoves = [move];
            } else if (moveAccess === leastAccess) {
                smallestMoves.push(move);
            }
        }
        return smallestMoves[Math.floor(Math.random() * smallestMoves.length)];
    }
    drawBoard() {
        for (let i = 0; i < this.props.width; i++) {
            for (let j = 0; j < this.props.height; j++) {
                this.drawSquare([i, j]);
                if (this.state.showAccess && this.isValidMove([i, j])) {
                    this.drawAccess([i, j]);
                }
            }
        }
        let cur = this.state.knightPos;
        for (let next of this.state.traversed) {
            let nextIndex = this.intToIndex(next);
            this.ctx.beginPath();
            this.ctx.moveTo(...this.posToCoords(cur).map(c => c + this.state.squareSide / 2));
            this.ctx.lineTo(...this.posToCoords(nextIndex).map(c => c + this.state.squareSide / 2));
            this.ctx.strokeStyle = "#000000";
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            cur = nextIndex;
        }
        if (this.knightImg.complete) {
            this.ctx.drawImage(this.knightImg, ...this.posToCoords(this.state.knightPos),
                this.state.squareSide, this.state.squareSide);
        }
    }
    drawAccess(pos) {
        this.ctx.font = (this.state.squareSide / 2).toString() + "px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = 'middle';
        let coords = [this.posToCoords(pos)[0] + this.state.squareSide / 2,
            this.posToCoords(pos)[1] + this.state.squareSide / 2];
        this.ctx.fillText(this.getValidMoves(pos).length.toString(), ...coords);
    }
    render() {
        return (
            <div>
                <div>
                    <canvas id={"canvas" + this.props.id}
                            width={500}
                            height={500}
                            ref={this.setContext}
                            onClick={this.handleClick} />
                </div>
                <div>
                    <Button
                        variant="outlined"
                        onClick={this.handleReset}>Reset</Button>
                    <Button
                        variant="outlined"
                        onClick={this.handleStep}>Step</Button>
                    <Button
                        variant="outlined"
                        onClick={this.handleAccess}>Show Accessibility</Button>
                </div>
            </div>
        );
    }
}