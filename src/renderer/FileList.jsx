import React from "react";
import {Popover, Overlay, Button, FormControl, Form, ListGroup} from "react-bootstrap";
import ListItem from "./ListItem";
import {ipcRenderer} from "electron";
import style from "./css/NavPanel.css";

export default class FileList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            //Data
            newFileName: "",
            //UI
            isOpenCreate: false
        };

        this.CreateWin_Toggle = this.CreateWin_Toggle.bind(this);
        this.OnFileNameChange = this.OnFileNameChange.bind(this);
        this.OnCreateWin_OKClick = this.OnCreateWin_OKClick.bind(this);
    }

    // * CreateFile
    CreateWin_Toggle(e){
        this.setState({
            isOpenCreate: !this.state.isOpenCreate,
            target: e.target
        });
    }
    OnFileNameChange(e){
        this.setState({newFileName: e.target.value});
    }
    OnCreateWin_OKClick(e){
        e.preventDefault();
        //파일명규칙검사필요
        //props.files에 동일파일명존재 검사도
        ipcRenderer.send("RM_NEWFILE", this.state.newFileName + ".txt");
        this.setState({
            newFileName: "",
            isOpenCreate: false
        });
    }

    // * File Select
    onClickFile(fileName){
        ipcRenderer.send("RM_OPENFILE", fileName);
    }

    // * Render
    renderFileList(){
        return(
            <ListGroup className={style.flexRemain_scroll}>
                {this.props.files.map(f=>
                    <ListItem
                        txtInfo={f}
                        selected={f.name === this.props.selectedFile}
                        onClickItem={this.onClickFile.bind(this, f.name)}/>
                    )}
            </ListGroup>
        );
    }
    renderCreatePopup(){
        return(
            <Popover title='Create TextFile'>
                <Form onSubmit={this.OnCreateWin_OKClick}>
                    <FormControl
                        type="text"
                        placeholder="file name"
                        value={this.state.newFileName}
                        onChange={this.OnFileNameChange}/>
                    <Button type="submit" bsStyle="primary">
                        Create
                    </Button>
                </Form>
            </Popover>
        );
    }

    render(){
        return(
            <div className={style.verticalFlex}>
                {this.renderFileList()}
                <Button
                    className={style.createButton}
                    onClick={this.CreateWin_Toggle}>
                        Create TextFile
                </Button>
                <Overlay
                    show={this.state.isOpenCreate}
                    target={this.state.target}
                    placement="top">
                        {this.renderCreatePopup()}
                </Overlay>
            </div>
        );
    }
}