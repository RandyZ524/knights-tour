import TourBoard from './TourBoard';
import Button from "@material-ui/core/Button";
import React from "react";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

export default class AutoBoard extends TourBoard {
    constructor(props) {
        super(props);
        this.state["showAccess"] = this.props.defaultAccess;
        this.state["checked"] = false;
        this.t = undefined;
        this.repeat = this.repeat.bind(this);
    }

    repeat() {
        if (this.handleStep() && this.handleStep()) {
            this.t = setTimeout(this.repeat, 0);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.posEqual(this.state.knightPos, this.props.knight)) {
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
        if (this.state.traversed.length !== this.props.width * this.props.height) {
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
        this.setState({
            checked: !this.state.checked,
        });
        if (!this.state.checked) {
            this.repeat();
        } else {
            clearTimeout(this.t);
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
            let farthest = Number.MAX_SAFE_INTEGER;
            let farthestMoves = [];
            let center = [(this.props.width - 1) / 2, (this.props.height - 1) / 2];
            for (let move of smallestMoves) {
                let squareDist = Math.pow(move[0] - center[0], 2) +
                    Math.pow(move[1] - center[1], 2);
                if (squareDist < farthest) {
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
            for (let i = 0; i < this.props.width; i++) {
                for (let j = 0; j < this.props.height; j++) {
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
        let access = this.getValidMoves(pos).length;
        if (this.state.showAccess && this.isValidMove(pos) && access !== 0) {
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
                <div>
                    <canvas
                        id={"canvas" + this.props.id}
                        width={this.props.width * this.state.squareSide}
                        height={this.props.height * this.state.squareSide}
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