import React from 'react';

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squareSide: Math.min(
                500 / this.props.height,
                500 / this.props.width),
            knightPos: this.props.knight,
            clicked: false,
        };
        this.setContext = this.setContext.bind(this);
        this.knightImg = new Image(this.state.squareSide, this.state.squareSide);
        this.knightImg.src = process.env.PUBLIC_URL + "knight.png";
    }
    setContext(r) {
        this.ctx = r.getContext("2d");
    }
    componentDidMount() {
        this.drawTemp();
        this.drawBoard();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.posEqual(this.state.knightPos, this.props.knight)) {
            this.drawBoard();
        }
        if (this.state.clicked !== prevState.clicked) {
            this.drawBoard([this.state.knightPos,
                ...this.getValidMoves(this.state.knightPos)]);
        } else if (!this.posEqual(this.state.knightPos, prevState.knightPos)) {
            this.drawBoard([this.state.knightPos, prevState.knightPos,
                ...this.getValidMoves(this.state.knightPos),
                ...this.getValidMoves(prevState.knightPos)]);
        }
    }
    handleClick(e) {
        let clickCoords = this.coordsToPos(this.getMousePos(e));
        if (this.posEqual(this.state.knightPos, clickCoords)) {
            this.setState({
                clicked: !this.state.clicked,
            });
        } else if (this.state.clicked && this.isValidMove(clickCoords)) {
            this.setState({
                knightPos: clickCoords,
            })
        }
    }
    getMousePos = (e) => {
        let canvasRef = document.getElementById("canvas" + this.props.id);
        let bound = canvasRef.getBoundingClientRect();
        return [
            (e.clientX - bound.left) / (bound.right - bound.left) * canvasRef.width,
            ((e.clientY - bound.top) / (bound.bottom - bound.top) * canvasRef.height)
        ];
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
                this.posEqual(this.state.knightPos, moves[i])) {
                moves.splice(i, 1);
            }
        }
        return moves;
    }
    drawTemp = () => {
        let temp = new Image(this.state.squareSide, this.state.squareSide);
        temp.src = process.env.PUBLIC_URL + "knight.png";
        let coords = this.posToCoords(this.state.knightPos);
        let ctxRef = this.ctx;
        let squareRef = this.state.squareSide;
        temp.onload = function() {
            ctxRef.drawImage(temp, ...coords,
                squareRef, squareRef);
        }
    }
    drawBoard(redraw = []) {
        if (redraw.length === 0) {
            this.ctx.clearRect(0, 0, 500, 500);
            for (let i = 0; i < this.props.width; i++) {
                for (let j = 0; j < this.props.height; j++) {
                    this.drawSquare([i, j]);
                }
            }
        } else for (let pos of redraw) {
            this.drawSquare(pos);
            this.drawValid(pos);
        }
        if (this.knightImg.complete) {
            this.ctx.drawImage(this.knightImg, ...this.posToCoords(this.state.knightPos),
                this.state.squareSide, this.state.squareSide);
        }
    }
    drawSquare = (pos) => {
        let color = this.getColor(pos);
        let coords = this.posToCoords(pos);
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(...coords, this.state.squareSide, this.state.squareSide);
    }
    drawValid = (pos) => {
        if (this.state.clicked && this.isValidMove(pos)) {
            this.ctx.beginPath();
            this.ctx.fillStyle = (pos[0] + pos[1]) % 2 === 0 ? '#819769' : '#646c44';
            this.ctx.arc(...this.posToCoords(pos).map(c => c + this.state.squareSide / 2),
                this.state.squareSide / 7, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    posToCoords = (pos) => {
        return pos.map(i => i * this.state.squareSide);
    }
    coordsToPos = (coords) => {
        return coords.map(c => Math.floor(c / this.state.squareSide));
    }
    getColor(pos) {
        if (this.posEqual(this.state.knightPos, pos) && this.state.clicked) {
            return '#829769';
        } else {
            return (pos[0] + pos[1]) % 2 === 0 ? '#f0d9b5' : '#b58863';
        }
    }
    posEqual = (pos1, pos2) => {
        return pos1[0] === pos2[0] && pos1[1] === pos2[1];
    }
    isValidMove(pos) {
        const deltaX = Math.abs(this.state.knightPos[0] - pos[0]);
        const deltaY = Math.abs(this.state.knightPos[1] - pos[1]);
        return deltaX > 0 && deltaY > 0 && deltaX + deltaY === 3;
    }
    render() {
        return (
            <div>
                <canvas id={"canvas" + this.props.id}
                    width={500}
                    height={500}
                    ref={this.setContext}
                    onClick={(e) => this.handleClick(e)} />
            </div>
        );
    }
}