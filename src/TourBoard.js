import Board from "./Board";
import React from "react";
import Button from '@material-ui/core/Button';

export default class TourBoard extends Board {
    constructor(props) {
        super(props);
        this.state["traversed"] = new Set();
    }

    getColor(pos) {
        if (this.state.traversed.has(pos.toString())) {
            return '#ffffff';
        } else {
            return super.getColor(pos);
        }
    }

    isValidMove(pos) {
        if (this.state.traversed.has(pos.toString())) {
            return false;
        } else {
            return super.isValidMove(pos);
        }
    }
    handleReset() {
        this.state = {
            knightPos: this.props.knight,
            clicked: false,
            traversed: new Set(),
        };
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