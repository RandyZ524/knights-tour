import Board from './Board';
import React from 'react';
import Button from '@material-ui/core/Button';

export default class TourBoard extends Board {
    constructor(props) {
        super(props);
        this.state["traversed"] = [];
    }

    indexToInt = (pos) => {
        return pos[1] * this.props.width + pos[0];
    }
    intToIndex = (int) => {
        return [(int % this.props.width), Math.floor(int / this.props.width)];
    }

    getColor(pos) {
        return this.state.traversed.includes(this.indexToInt(pos)) ? '#ffffff' : super.getColor(pos);
    }

    getValidMoves = (pos) => {
        let moves = this.getPossibleMoves(pos);
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
    isValidMove = (pos) => {
        return this.state.traversed.includes(this.indexToInt(pos)) ? false : super.isValidMove(pos);
    }
    handleClick = (e) => {
        let clickCoords = this.coordsToPos(this.getMousePos(e));
        if (this.posEqual(this.state.knightPos, clickCoords)) {
            this.setState({
                clicked: !this.state.clicked,
            });
        } else if (this.state.clicked && this.isValidMove(clickCoords)) {
            this.setState(prevState => ({
                traversed: [this.indexToInt(this.state.knightPos), ...prevState.traversed],
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
                <div>
                    <canvas
                        id={"canvas" + this.props.id}
                        width={this.props.width * this.state.squareSide}
                        height={this.props.height * this.state.squareSide}
                        ref={this.setContext}
                        onClick={(e) => this.handleClick(e)}/>
                </div>
                <div>
                    <Button
                        variant="outlined"
                        onClick={this.handleReset}>Reset</Button>
                </div>
            </div>
        );
    }
}