import React from "react";
import {Button, Modal} from "react-bootstrap";
import { ipcRenderer } from "electron";

export default class About extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            show: false
        };
        this.handleClose = this.handleClose.bind(this);
    }
    componentDidMount(){
        ipcRenderer.on("MR_MODAL_ABOUT", (_e) =>{
            console.log("modal");
            this.setState({show: true});
        });
    }
    componentWillUnmount(){
        ipcRenderer.removeAllListeners();
    }
    handleClose(){
        this.setState({show: false});
    }
    render(){
        return(
                <Modal
                    show={this.state.show}
                    onHide={this.handleClose}
                
                >
                    <Modal.Body style={{textAlign: "center"}}>
                        <img src={require("./../images/keyword.svg")}
                                style={{height: "64px"}}/>
                        <p>
                            <h1>KeyMo</h1>
                            v.1.0.0<br/>
                            <a href="https://github.com/hjjjong0811/KeyMo">Repository</a>
                        </p>
                        <p>
                            <h3>OSS</h3>
                            <a href="https://electronjs.org/">Electron</a> / 
                            <a href="https://reactjs.org/">React</a> / 
                            <a href="https://react-bootstrap.github.io/">React-bootstrap</a>
                            <h3>ICON</h3>
                            <ul style={{listStyleType: "none"}}>
                                <li>designed by Those Icons from Flaticon</li>
                                <li>designed by Gregor Cresnar from Flaticon</li>
                            </ul>
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
        );
    }
}