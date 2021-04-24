import Board from './Board';

export default class ExampleBoard extends Board {
    handleClick = (e) => {
        if (this.props.movable) {
            super.handleClick(e);
        }
    }
    drawAccess(pos) {
        let access = this.getValidMoves(pos).length;
        if (this.props.showAccess && this.isValidMove(pos) && access !== 0) {
            this.ctx.font = (this.state.squareSide / 2).toString() + "px Arial";
            this.ctx.fillStyle = "black";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = 'middle';
            let coords = [this.posToCoords(pos)[0] + this.state.squareSide / 2,
                this.posToCoords(pos)[1] + this.state.squareSide / 2];
            this.ctx.fillText(access.toString(), ...coords);
        }
    }
    drawBoard(redraw = []) {
        if (redraw.length === 0) {
            for (let i = 0; i < this.props.width; i++) {
                for (let j = 0; j < this.props.height; j++) {
                    this.drawSquare([i, j]);
                    this.drawAccess([i, j]);
                }
            }
        } else for (let pos of redraw) {
            this.drawSquare(pos);
            this.drawAccess(pos);
        }
        if (this.knightImg.complete) {
            this.ctx.drawImage(this.knightImg, ...this.posToCoords(this.state.knightPos),
                this.state.squareSide, this.state.squareSide);
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