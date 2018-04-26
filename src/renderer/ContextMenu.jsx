import React from "react";
import { MenuItem } from "react-bootstrap";

export default class ContextMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen : false,
            position : {x:0,y:0},
            height : 0
        }
        this.openContextMenu = this.openContextMenu.bind(this);
        this.contextClose = this.contextClose.bind(this);
    }

    componentDidMount() {
        document.addEventListener("contextmenu", this.openContextMenu);
        document.addEventListener("click", this.contextClose);
        this.setState({
            height: this.menuElement.clientHeight
        })
    }
    componentWillUnmount() {
        document.removeEventListener("contextmenu", this.openContextMenu);
        document.removeEventListener("click", this.contextClose);
    }

    openContextMenu(e) {
        e.preventDefault();
        if (this.props.container.contains(e.target)) {
            var pos = { x: e.clientX, y: e.clientY };
            this.setState({
                position: pos,
                isOpen: true
            });
        }else{
            this.setState({ isOpen: false });
        }
    }
    contextClose() {
        this.setState({ isOpen: false });
    }
    getStyle() {
        if(!this.state.isOpen){return({display:"block",top: "-999999px"});}
        var top = this.state.position.y;
        if(window.innerHeight < top + this.state.height){
            top = top - this.state.height;
        }
        return ({
            position: "fixed",
            display: "block",
            top: top,
            left: this.state.position.x,
            width: "150px",
            height: this.state.height
        });
    }

    render() {
        return (
            <ul
                className="dropdown-menu open"
                style={this.getStyle()}
                ref={(menuElement)=> this.menuElement = menuElement}
            >
                <MenuItem header>{this.props.ID}</MenuItem>
                <MenuItem divider/>
                {this.props.menuList.map(m=>
                    <MenuItem onSelect={m.onSelect}>{m.label}</MenuItem>
                )}
            </ul>
        )
    };
}