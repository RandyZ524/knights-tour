import AutoBoard from "./AutoBoard";
import React from "react";
import {basic, center, mouse} from "./Tiebreakers";

export default class TiebreakBoard extends AutoBoard {
    constructor(props) {
        super(props);
        this.state["currMouse"] = [0, 0];
        this.state["tiebreaker"] = {
            extreme: "to the farthest point",
            dist: "Euclidean",
            point: "center",
        };
    }

    handleMove = (e) => {
        this.setState({
            currMouse: this.coordsToPos(this.getMousePos(e)),
        });
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

    render() {
        return (
            <div>
                <div className="Inline-dropdown">
                    <p>Ties are awarded </p>
                    <u onClick={this.handleExtreme}>{this.state.tiebreaker.extreme}</u>
                    {this.state.tiebreaker.extreme !== "randomly" &&
                    <p> by </p>}
                    {this.state.tiebreaker.extreme !== "randomly" &&
                    <u onClick={this.handleDistance}>{this.state.tiebreaker.dist}</u>}
                    {this.state.tiebreaker.extreme !== "randomly" &&
                    <p> distance relative to the </p>}
                    {this.state.tiebreaker.extreme !== "randomly" &&
                    <u onClick={this.handlePoint}>{this.state.tiebreaker.point}</u>}
                    <p>.</p>
                </div>
                {super.render()}
            </div>
        )
    }
}