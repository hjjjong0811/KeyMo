import React from "react";
import {Popover, Overlay, Button, FormControl, Tooltip,
         InputGroup, InputGroupButton, ListGroup} from "react-bootstrap";
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
            isOpenCreate: false,
            isOpenTooltip_create: false,
            createTooltip: ""
        };

        this.CreateWin_Toggle = this.CreateWin_Toggle.bind(this);
        this.OnFileNameChange = this.OnFileNameChange.bind(this);
        this.OnCreateWin_OKClick = this.OnCreateWin_OKClick.bind(this);
    }

    // * CreateFile
    CreateWin_Toggle(e){
        this.setState({
            newFileName: "",
            isOpenCreate: !this.state.isOpenCreate,
            isOpenTooltip_create: false,
            target: e.target
        });
    }
    OnFileNameChange(e){
        this.setState({newFileName: e.target.value, target_form: e.target, isOpenTooltip_create:false});
    }
    OnCreateWin_OKClick(e){
        e.preventDefault();
        ipcRenderer.send("RM_NEWFILE", this.state.newFileName + ".txt");
        ipcRenderer.once("MR_ISNEWCOMPLETE", (_e, result) => {
            if(result==1){
                this.setState({
                    newFileName: "",
                    isOpenCreate: false
                });

            }else if(result==0){
                this.inputFile.focus();
                this.setState({
                    isOpenTooltip_create: true,
                    createTooltip: "이미 존재하는 파일명입니다"
                });
                setTimeout(function(){
                    this.setState({isOpenTooltip_create: false})}.bind(this), 2000);
            }else if(result==-1){
                this.inputFile.focus();
                this.setState({
                    isOpenTooltip_create: true,
                    createTooltip: "파일 이름에는 \\ / : * ? \" < > | 의 문자를 사용할 수 없습니다"
                });
                setTimeout(function(){
                    this.setState({isOpenTooltip_create: false})}.bind(this), 2000);
            }
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
                        onClickItem={this.onClickFile.bind(this, f.name)}
                        theme={this.props.theme}/>
                    )}
            </ListGroup>
        );
    }
    renderCreatePopup(){
        return(
            <Popover title='Create TextFile'>
                <form onSubmit={this.OnCreateWin_OKClick}>
                    <InputGroup>
                        <FormControl
                            inputRef={ref => {this.inputFile = ref;}}
                            type="text"
                            placeholder="file name"
                            value={this.state.newFileName}
                            onChange={this.OnFileNameChange}/>
                        <InputGroup.Button>
                            <Button type="submit" bsStyle="primary">
                                Create
                            </Button>
                        </InputGroup.Button>
                    </InputGroup>
                </form>

                <Overlay
                    container= {this}
                    target= {this.state.target_form}
                    show={this.state.isOpenTooltip_create}
                    placement="top">
                    <Tooltip id="fileNametooltip">{this.state.createTooltip}</Tooltip>
                </Overlay>
            </Popover>
        );
    }
    render(){
        return(
            <div className={style.verticalFlex}>
                <Button
                    onClick={this.CreateWin_Toggle}>
                        Create TextFile
                </Button>
                <Overlay
                    show={this.state.isOpenCreate}
                    target={this.state.target}
                    placement="bottom">
                        {this.renderCreatePopup()}
                </Overlay>
                {this.renderFileList()}
            </div>
        );
    }
}