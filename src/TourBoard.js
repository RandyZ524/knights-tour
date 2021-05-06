import Board from './Board';
import React from 'react';
import Button from '@material-ui/core/Button';

export default class TourBoard extends Board {
    constructor(props) {
        super(props);
        this.state["traversed"] = [];
        this.state["currWidth"] = this.props.width;
        this.state["currHeight"] = this.props.height;
    }

    indexToInt = (pos) => {
        return pos[1] * this.state.currWidth + pos[0];
    }
    intToIndex = (int) => {
        return [(int % this.state.currWidth), Math.floor(int / this.state.currWidth)];
    }

    getColor(pos) {
        return this.state.traversed.includes(
            this.indexToInt(pos)) ? '#ffffff' : super.getColor(pos);
    }

    getValidMoves = (pos) => {
        let moves = this.getPossibleMoves(pos);
        for (let i = moves.length; i--;) {
            if (moves[i][0] < 0 || moves[i][0] >= this.state.currWidth ||
                moves[i][1] < 0 || moves[i][1] >= this.state.currHeight ||
                this.state.traversed.includes(this.indexToInt(moves[i])) ||
                this.posEqual(this.state.knightPos, moves[i])) {
                moves.splice(i, 1);
            }
        }
        return moves;
    }
    isValidMove = (pos) => {
        return this.state.traversed.includes(this.indexToInt(pos)) ? false : super.isValidMove(pos);
    }
    handleClick = (e) => {
        let clickCoords = this.coordsToPos(this.getMousePos(e));
        if (this.posEqual(this.state.knightPos, clickCoords)) {
            this.setState(prevState => ({
                clicked: !prevState.clicked,
            }));
        } else if (this.state.clicked && this.isValidMove(clickCoords)) {
            this.setState(prevState => ({
                traversed: [this.indexToInt(prevState.knightPos), ...prevState.traversed],
                knightPos: clickCoords,
            }));
        }
    }
    handleReset = () => {
        this.setState({
            knightPos: this.props.knight,
            clicked: false,
            traversed: [],
        });
    }

    render() {
        return (
            <div>
                {super.render()}
                <Button
                    variant="outlined"
                    onClick={this.handleReset}>Reset</Button>
            </div>
        );
    }
}