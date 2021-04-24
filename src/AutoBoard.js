import TourBoard from './TourBoard';
import Button from "@material-ui/core/Button";
import React from "react";

export default class AutoBoard extends TourBoard {
    constructor(props) {
        super(props);
        this.state["showAccess"] = this.props.defaultAccess;
        this.t = undefined;
        this.start = 500;
        this.repeat = this.repeat.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }
    repeat() {
        if (this.handleStep()) {
            if (this.start === 1) {
                this.t = setTimeout(this.repeat, 0);
            } else {
                this.t = setTimeout(this.repeat, this.start);
                this.start = Math.max(this.start * 0.9, 1);
            }
        }
    }
    onMouseUp() {
        this.t = setTimeout(this.repeat, 500);
    }
    onMouseDown() {
        clearTimeout(this.t);
        this.start = 500;
    }
    handleClick = () => {}
    handleStep = () => {
        console.log((this.props.width * this.props.height) - this.state.traversed.length);
        if (this.state.traversed.length !== this.props.width * this.props.height - 1) {
            let moves = this.getValidMoves(this.state.knightPos);
            if (moves.length !== 0) {
                this.setState(prevState => ({
                    knightPos: this.chooseLeastAccess(moves),
                    traversed: [this.indexToInt(this.state.knightPos), ...prevState.traversed],
                }));
                return true;
            }
        }
        return false;
    }
    handleAccess = () => {
        this.setState(prevState => ({
            showAccess: !prevState.showAccess,
        }));
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
        /*if (smallestMoves.length !== 1) {
            let farthest = -1;
            let farthestMoves = [];
            let center = [(this.props.width - 1) / 2, (this.props.height - 1) / 2];
            for (let move of smallestMoves) {
                let squareDist = Math.pow(move[0] - center[0], 2) +
                    Math.pow(move[1] - center[1], 2);
                if (squareDist > farthest) {
                    farthest = squareDist;
                    farthestMoves = [move];
                } else if (squareDist === farthest) {
                    farthestMoves.push(move);
                }
            }
            return farthestMoves[Math.floor(Math.random() * farthestMoves.length)];
        } else {
            return smallestMoves[0];
        }*/
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
            this.ctx.lineWidth = 1;
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
                        onClick={this.handleStep}
                        onMouseUp={this.onMouseUp}
                        onMouseDown={this.onMouseDown}>Step</Button>
                    <Button
                        variant="outlined"
                        onClick={this.handleAccess}>Show Accessibility</Button>
                </div>
            </div>
        );
    }
}