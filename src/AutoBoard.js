import TourBoard from './TourBoard';
import Button from "@material-ui/core/Button";
import React from "react";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import {TextField} from "@material-ui/core";

export default class AutoBoard extends TourBoard {
    constructor(props) {
        super(props);
        this.state["showAccess"] = this.props.defaultAccess;
        this.state["checked"] = false;
        this.t = undefined;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.posEqual(this.state.knightPos, this.props.knight) ||
            this.state.currWidth !== prevState.currWidth ||
            this.state.currHeight !== prevState.currHeight) {
            this.drawBoard();
        }
        if (!this.posEqual(this.state.knightPos, prevState.knightPos)) {
            this.drawBoard([this.state.knightPos, prevState.knightPos,
                ...this.getValidMoves(this.state.knightPos),
                ...this.getValidMoves(prevState.knightPos)]);
        } else if (this.state.showAccess !== prevState.showAccess) {
            this.drawBoard([...this.getValidMoves(this.state.knightPos)]);
        }
    }

    handleClick = () => {
    }
    handleReset = () => {
        this.setState({
            knightPos: this.props.knight,
            traversed: [],
            checked: false,
        });
        clearTimeout(this.t);
    }
    handleStep = () => {
        console.log((this.props.width * this.props.height) - this.state.traversed.length);
        if (this.state.traversed.length !== this.state.currWidth * this.state.currHeight) {
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
        this.setState({
            showAccess: !this.state.showAccess,
        });
    }
    handleSwitch = () => {
        const repeat = () => {
            if (!this.handleStep()) {
                clearInterval(this.t);
            }
        }
        this.setState({
            checked: !this.state.checked,
        });
        if (!this.state.checked) {
            let timeout = 5000 / (this.state.currWidth * this.state.currHeight);
            if (timeout < 1) {
                timeout = 0;
            }
            repeat();
            this.t = setInterval(() => repeat(), timeout);
        } else {
            clearInterval(this.t);
        }
    }
    handleWidth = (e) => {
        if (e.target.value !== "") {
            if (e.target.value < 1) {
                e.target.value = 1;
            } else if (e.target.value > 200) {
                e.target.value = 200;
            }
            if (e.target.value >= 1 && e.target.value <= 200) {
                this.setState({
                    currWidth: e.target.value,
                    squareSide: Math.min(
                        500 / e.target.value, 500 / this.state.currHeight),
                });
                this.handleReset();
            }
        }
    }
    handleHeight = (e) => {
        if (e.target.value !== "") {
            if (e.target.value < 1) {
                e.target.value = 1;
            } else if (e.target.value > 200) {
                e.target.value = 200;
            } else if (e.target.value >= 1 && e.target.value <= 200) {
                this.setState({
                    currHeight: e.target.value,
                    squareSide: Math.min(
                        500 / this.state.currWidth, 500 / e.target.value),
                });
                this.handleReset();
            }
        }
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
        if (smallestMoves.length !== 1) {
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
        }
        //return smallestMoves[Math.floor(Math.random() * smallestMoves.length)];
    }

    drawBoard(redraw = []) {
        if (redraw.length === 0) {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            console.log(this.state.currWidth);
            for (let i = 0; i < this.state.currWidth; i++) {
                for (let j = 0; j < this.state.currHeight; j++) {
                    this.drawSquare([i, j]);
                    this.drawAccess([i, j]);
                }
            }
        } else {
            for (let pos of redraw) {
                this.drawAccess(pos);
            }
            if (this.state.traversed.length !== 0) {
                this.drawTravelLine(this.state.knightPos, this.intToIndex(this.state.traversed[0]));
                if (this.state.traversed.length !== 1) {
                    this.drawTravelLine(this.intToIndex(this.state.traversed[1]),
                        this.intToIndex(this.state.traversed[0]));
                }
            }
        }
        this.drawKnight();
    }

    drawTravelLine(pos1, pos2) {
        this.ctx.beginPath();
        this.ctx.moveTo(...this.posToCoords(pos1).map(c => c + this.state.squareSide / 2));
        this.ctx.lineTo(...this.posToCoords(pos2).map(c => c + this.state.squareSide / 2));
        this.ctx.strokeStyle = "#000000";
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    drawAccess(pos) {
        if (this.state.showAccess && this.isValidMove(pos)) {
            this.ctx.font = (this.state.squareSide / 2).toString() + "px Arial";
            this.ctx.fillStyle = "black";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = 'middle';
            let coords = this.posToCoords(pos).map(c => c + this.state.squareSide / 2);
            this.ctx.fillText(this.getValidMoves(pos).length.toString(), ...coords);
        } else {
            let lengthFactor = 0.65;
            let distFromEdge = (1 - lengthFactor) / 2;
            let coords = this.posToCoords(pos)
                .map(c => (c + this.state.squareSide * distFromEdge));
            this.ctx.beginPath();
            this.ctx.fillStyle = (pos[0] + pos[1]) % 2 === 0 ? '#f0d9b5' : '#b58863';
            this.ctx.fillRect(...coords,
                this.state.squareSide * lengthFactor, this.state.squareSide * lengthFactor);
        }
    }

    render() {
        return (
            <div>
                {this.props.modifiable &&
                <TextField
                    type="number" id="standard-number"
                    label="Set width"
                    defaultValue={this.props.width}
                    onInput={this.handleWidth}/>}
                {this.props.modifiable &&
                <TextField
                    type="number" id="standard-number"
                    label="Set height"
                    defaultValue={this.props.height}
                    onInput={this.handleHeight}/>}
                <div>
                    <canvas
                        id={"canvas" + this.props.id}
                        width={this.state.currWidth * this.state.squareSide}
                        height={this.state.currHeight * this.state.squareSide}
                        ref={this.setContext}
                        onClick={this.handleClick}/>
                </div>
                <div>
                    <Button
                        variant="outlined"
                        onClick={this.handleReset}>Reset</Button>
                    <Button
                        variant="outlined"
                        onClick={this.handleStep}>Step</Button>
                    <FormControlLabel
                        control={<Switch checked={this.state.showAccess} onChange={this.handleAccess}/>}
                        label="Show accessibility"/>
                    <FormControlLabel
                        control={<Switch checked={this.state.checked} onChange={this.handleSwitch}/>}
                        label="Auto-solve"/>
                </div>
            </div>
        );
    }
}