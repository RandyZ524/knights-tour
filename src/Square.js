import React from 'react'

class Square extends React.Component {
    render() {
        return (
            <div
                style={{backgroundColor: this.props.color}}
                className="square"
                color="black"
                onClick={this.props.onClick}>
                {this.props.value}
                <img src={process.env.PUBLIC_URL + this.props.src}
                     style={{
                         position: "center", zIndex: 2, opacity: this.props.src ? 1 : 0,
                     }}
                     alt={"N"}/>
            </div>
        );
    }
}

export default Square;