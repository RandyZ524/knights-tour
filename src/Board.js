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
        this.drawBoard();
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
    drawBoard() {
        for (let i = 0; i < this.props.width; i++) {
            for (let j = 0; j < this.props.height; j++) {
                this.drawSquare([i, j]);
                if (this.state.clicked && this.isValidMove([i, j])) {
                    this.drawValid([i, j]);
                }
            }
        }
        if (this.knightImg.complete) {
            this.ctx.drawImage(this.knightImg, ...this.posToCoords(this.state.knightPos),
                this.state.squareSide, this.state.squareSide);
        }
    }
    drawSquare = (pos) => {
        let coords = this.posToCoords(pos);
        this.ctx.beginPath();
        this.ctx.fillStyle = this.getColor(pos);
        this.ctx.fillRect(...coords, this.state.squareSide, this.state.squareSide);
    }
    drawValid = (pos) => {
        this.ctx.beginPath();
        this.ctx.fillStyle = (pos[0] + pos[1]) % 2 === 0 ? '#819769' : '#646c44';
        this.ctx.arc(...this.posToCoords(pos).map(c => c + this.state.squareSide / 2),
            this.state.squareSide / 7, 0, 2 * Math.PI);
        this.ctx.fill();
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