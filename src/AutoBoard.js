import TourBoard from './TourBoard';
import Button from "@material-ui/core/Button";
import React from "react";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import {TextField} from "@material-ui/core";
import {basic, center, mouse} from './Tiebreakers';

export default class AutoBoard extends TourBoard {
    constructor(props) {
        super(props);
        this.state["showAccess"] = this.props.defaultAccess;
        this.state["checked"] = false;
        this.state["currMouse"] = [0, 0];
        this.state["tiebreaker"] = {
            extreme: "to the farthest point",
            dist: "Euclidean",
            point: "center",
        };
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

    handleClick = () => {}

    handleMove = (e) => {
        this.setState({
            currMouse: this.coordsToPos(this.getMousePos(e)),
        });
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
        console.log((this.state.currWidth * this.state.currHeight) - this.state.traversed.length);
        if (this.state.traversed.length !== this.state.currWidth * this.state.currHeight) {
            let moves = this.getValidMoves(this.state.knightPos);
            let tiebreaker = undefined;
            if (this.state.tiebreaker.extreme === "randomly") {
                tiebreaker = basic();
            } else if (this.state.tiebreaker.point === "center") {
                tiebreaker = center(this.state.currWidth, this.state.currHeight,
                    this.state.tiebreaker.extreme, this.state.tiebreaker.dist);
            } else {
                tiebreaker = mouse(this.state.currWidth, this.state.currHeight,
                    this.state.tiebreaker.extreme, this.state.tiebreaker.dist, this.state.currMouse);
            }
            if (moves.length !== 0) {
                this.setState(prevState => ({
                    knightPos: this.chooseLeastAccess(moves, tiebreaker),
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

    handleSwitch = () => {
        const repeat = () => {
            if (!this.handleStep()) {
                clearInterval(this.t);
            }
        }
        this.setState(prevState => ({
            checked: !prevState.checked,
        }));
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

    handleExtreme = () => {
        let next = undefined;
        switch (this.state.tiebreaker.extreme) {
            case "randomly":
                next = "to the farthest point";
                break;
            case "to the farthest point":
                next = "to the closest point";
                break;
            case "to the closest point":
                next = "randomly";
                break;
            default:
                break;
        }
        this.setState(prevState => ({
            tiebreaker: {...prevState.tiebreaker, extreme: next}
        }));
    }

    handleDistance = () => {
        let next = undefined;
        switch (this.state.tiebreaker.dist) {
            case "Euclidean":
                next = "Manhattan";
                break;
            case "Manhattan":
                next = "Euclidean";
                break;
            default:
                break;
        }
        this.setState(prevState => ({
            tiebreaker: {...prevState.tiebreaker, dist: next}
        }));
    }

    handlePoint = () => {
        let next = undefined;
        switch (this.state.tiebreaker.point) {
            case "center":
                next = "current mouse position";
                break;
            case "current mouse position":
                next = "center";
                break;
            default:
                break;
        }
        this.setState(prevState => ({
            tiebreaker: {...prevState.tiebreaker, point: next}
        }));
    }

    chooseLeastAccess = (moves, tiebreaker) => {
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
            return tiebreaker(smallestMoves, this.state.currWidth, this.state.currHeight);
        } else {
            return smallestMoves[0];
        }
    }

    drawBoard(redraw = []) {
        if (redraw.length === 0) {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
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
                {this.props.dimenModifiable &&
                <TextField
                    type="number" label="Set width"
                    defaultValue={this.props.width}
                    onInput={this.handleWidth}/>}
                {this.props.dimenModifiable &&
                <TextField
                    type="number" label="Set height"
                    defaultValue={this.props.height}
                    onInput={this.handleHeight}/>}
                {this.props.tieModifiable &&
                <div className="Inline-dropdown">
                    <p>Ties are awarded </p>
                    <u onClick={this.handleExtreme}>{this.state.tiebreaker.extreme}</u>
                    {this.state.tiebreaker.extreme !== "randomly" && this.props.tieModifiable &&
                        <p> by </p>}
                    {this.state.tiebreaker.extreme !== "randomly" && this.props.tieModifiable &&
                        <u onClick={this.handleDistance}>{this.state.tiebreaker.dist}</u>}
                    {this.state.tiebreaker.extreme !== "randomly" && this.props.tieModifiable &&
                        <p> distance relative to the </p>}
                    {this.state.tiebreaker.extreme !== "randomly" && this.props.tieModifiable &&
                        <u onClick={this.handlePoint}>{this.state.tiebreaker.point}</u>}
                    <p>.</p>
                </div>}
                <div>
                    <canvas
                        id={"canvas" + this.props.id}
                        width={this.state.currWidth * this.state.squareSide}
                        height={this.state.currHeight * this.state.squareSide}
                        ref={this.setContext}
                        onClick={this.handleClick}
                        onMouseMove={this.handleMove}/>
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