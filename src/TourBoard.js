import Board from './Board';
import React from 'react';
import Button from '@material-ui/core/Button';

export default class TourBoard extends Board {
    constructor(props) {
        super(props);
        this.state["traversed"] = [];
    }
    indexToInt = (pos) => {
        return pos[0] * this.props.width + pos[1];
    }
    intToIndex = (int) => {
        return [Math.floor(int / this.props.width), (int % this.props.width)];
    }
    getColor(pos) {
        if (this.state.traversed.includes(this.indexToInt(pos))) {
            return '#ffffff';
        } else {
            return super.getColor(pos);
        }
    }
    isValidMove = (pos) => {
        if (this.state.traversed.includes(this.indexToInt(pos))) {
            return false;
        } else {
            return super.isValidMove(pos);
        }
    }
    handleClick = (e) => {
        let clickCoords = this.coordsToIndex(this.getMousePos(e));
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
        })
    }
    render() {
        return (
            <div>
                <div>
                    <canvas id={"canvas" + this.props.id}
                        width={500}
                        height={500}
                        ref={this.setContext}
                        onClick={(e) => this.handleClick(e)} />
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