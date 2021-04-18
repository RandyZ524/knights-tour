import React from 'react'
import Square from './Square'
import {Button} from "reactstrap";

class Board extends React.Component {
    constructor(props) {
        super(props);
        const grid = [];
        for (let i = 0; i < this.props.height; i++) {
            const row = [];
            for (let j = 0; j < this.props.width; j++) {
                row.push({})
            }
            grid.push(row)
        }

        this.state = {
            knightPos: this.props.knight,
            squares: grid,
            click: false,
            traversed: new Set(),
            showAccess: this.props.accessDefault,
        };
    }

    isValidMove(pos) {
        if (this.props.tourable && this.state.traversed.has(this.coordToInt(pos))) {
            return false;
        }
        const deltaX = Math.abs(this.state.knightPos[0] - pos[0]);
        const deltaY = Math.abs(this.state.knightPos[1] - pos[1]);
        return deltaX > 0 && deltaY > 0 && deltaX + deltaY === 3;
    }

    handleSquareClick(pos) {
        if (this.props.movable) {
            if (this.positionEqual(this.state.knightPos, pos)) {
                this.setState({click: !this.state.click});
            } else if (this.isValidMove(pos)) {
                this.setState({
                    traversed: this.state.traversed.add(this.coordToInt(this.state.knightPos)),
                    knightPos: pos,
                });
            }
        }
    }

    handleResetClick() {
        this.setState({
            traversed: new Set(),
            knightPos: this.props.knight,
            click: false,
        })
    }

    handleStepClick() {
        if (this.state.traversed.size !== this.props.width * this.props.height - 1) {
            this.setState({
                traversed: this.state.traversed.add(this.coordToInt(this.state.knightPos)),
                knightPos: this.chooseLeastAccess(this.getValidMoves(this.state.knightPos)),
            })
        }
    }

    getValidMoves(pos) {
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
            if (moves[i][0] < 0 || moves[i][0] >= this.props.height ||
                    moves[i][1] < 0 || moves[i][1] >= this.props.width ||
                    this.state.traversed.has(this.coordToInt(moves[i])) ||
                    this.positionEqual(this.state.knightPos, moves[i])) {
                moves.splice(i, 1);
            }
        }
        return moves;
    }

    chooseLeastAccess(moves) {
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

    positionEqual(pos1, pos2) {
        return pos1[0] === pos2[0] && pos1[1] === pos2[1];
    }

    coordToInt(pos) {
        return pos[0] * this.props.width + pos[1];
    }

    getColor(pos) {
        if (this.state.traversed.has(this.coordToInt(pos))) {
            return "#ffffff";
        } else if (this.positionEqual(this.state.knightPos, pos) && this.state.click) {
            return "#829769";
        } else {
            return ((pos[0] + pos[1]) % 2) === 0 ? '#f0d9b5' : '#b58863';
        }
    }

    getSource(pos) {
        if (this.positionEqual(this.state.knightPos, pos)) {
            return "knight.png";
        } else if (this.isValidMove(pos) && this.state.click) {
            return "valid-dot.png";
        } else {
            return "";
        }
    }

    getAccess(pos) {
        if (this.props.auto && this.state.showAccess && this.isValidMove(pos)) {
            return this.getValidMoves(pos).length.toString();
        } else {
            return "";
        }
    }

    isBottom(el) {
        return el.getBoundingClientRect().bottom * 2 <= window.innerHeight;
    }

    componentDidMount() {
        document.addEventListener('scroll', this.trackScrolling);
    }

    trackScrolling = () => {
        const wrappedElement = document.getElementById('header');
        if (!this.props.movable && !this.props.auto) {
            if (this.isBottom(wrappedElement)) {
                this.setState({
                    knightPos: [2, 3],
                })
            } else {
                this.setState({
                    knightPos: [1, 1],
                })
            }
        }
    };

    render() {
        return (
            <div id="header"> {this.state.squares.map((row, i) => (
                <div className="board-row"
                     style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    {row.map((square, j) => (<Square
                        key={j}
                        color={this.getColor([i, j])}
                        src={this.getSource([i, j])}
                        value={this.getAccess([i, j])}
                        onClick={() => this.handleSquareClick([i, j])}/>))}
                </div>))}
                {(this.props.movable || this.props.auto) && !this.props.example && <Button
                    variant="contained"
                    onClick={() => this.handleResetClick()}
                    color="secondary">
                    Reset
                </Button>}
                {this.props.auto && !this.props.example && <Button
                    variant="contained"
                    onClick={() => this.handleStepClick()}
                    color="secondary">
                    Step
                </Button>}
                {this.props.auto && !this.props.example && <Button
                    variant="contained"
                    onClick={() => this.setState({showAccess: !this.state.showAccess})}
                    color="secondary">
                    {this.state.showAccess ? "Hide Accessibility" : "Show Accessibility"}
                </Button>}
            </div>
        );
    }
}

export default Board;