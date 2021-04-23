import Board from './Board';

export default class ExampleBoard extends Board {
    handleClick = (e) => {
        if (this.props.movable) {
            super.handleClick(e);
        }
    }
    drawAccess(pos) {
        this.ctx.font = (this.state.squareSide / 2).toString() + "px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = 'middle';
        let coords = [this.posToCoords(pos)[0] + this.state.squareSide / 2,
            this.posToCoords(pos)[1] + this.state.squareSide / 2];
        this.ctx.fillText(this.getValidMoves(pos).length.toString(), ...coords);
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
            if (moves[i][0] < 0 || moves[i][0] >= this.props.height ||
                moves[i][1] < 0 || moves[i][1] >= this.props.width ||
                this.posEqual(this.state.knightPos, moves[i])) {
                moves.splice(i, 1);
            }
        }
        return moves;
    }
    drawBoard() {
        if (this.props.showAccess) {
            for (let i = 0; i < this.props.width; i++) {
                for (let j = 0; j < this.props.height; j++) {
                    this.drawSquare([i, j]);
                    if (this.isValidMove([i, j])) {
                        this.drawAccess([i, j]);
                    }
                }
            }
            if (this.knightImg.complete) {
                this.ctx.drawImage(this.knightImg, ...this.posToCoords(this.state.knightPos),
                    this.state.squareSide, this.state.squareSide);
            }
        } else {
            super.drawBoard();
        }
    }
    isBottom(el) {
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    }
    componentDidMount() {
        super.componentDidMount();
        document.addEventListener('scroll', this.trackScrolling);
    }
    trackScrolling = () => {
        if (this.props.scrolling) {
            if (this.isBottom(document.getElementById("canvas" + this.props.id))) {
                this.setState({
                    knightPos: this.props.knightTo,
                });
            } else {
                this.setState({
                    knightPos: this.props.knight,
                });
            }
        }
    }
}