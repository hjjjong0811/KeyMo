import React from "react";
import { MenuItem } from "react-bootstrap";
import style from "./css/ListItem.css";

export default class ContextMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen : false,
            position : {x:0,y:0}
        }
        this.openContextMenu = this.openContextMenu.bind(this);
        this.contextClose = this.contextClose.bind(this);
        this.test = this.test.bind(this);
    }

    componentDidMount() {
        document.addEventListener("contextmenu", this.openContextMenu);
        document.addEventListener("click", this.contextClose);
        document.addEventListener("scroll", this.contextClose);
    }
    componentWillUnmount() {
        document.removeEventListener("contextmenu", this.openContextMenu);
        document.removeEventListener("click", this.contextClose);
        document.removeEventListener("scroll", this.contextClose);
    }

    openContextMenu(e) {
        e.preventDefault();
        if (e.target.id === this.props.fileName) {
            var pos = { x: e.clientX, y: e.clientY };
            this.setState({
                position: pos,
                isOpen: true
            });
        }
    }
    contextClose() {
        this.setState({ isOpen: false });
    }
    getStyle() {
        var top = this.state.position.y;
        if(window.innerHeight < top + 100){
            top = top - 100;
        }
        return ({
            top: top,
            left: this.state.position.x,
            width: "150px",
            height: "100px"
        });
    }
    test(){
        console.log("눌렀다!");
    }

    render() {
        return (
            <div
                className={this.state.isOpen ? style.contextMenu_Active : style.contextMenu_Disable}
                onClick={this.test}
                style={this.getStyle()}
            >
                {this.props.fileName}
            </div>
        )
    };
}