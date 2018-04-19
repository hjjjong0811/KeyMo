import React from "react";
import layout from "./css/ViewPanel.css";
import {ipcRenderer} from "electron";
import {Button} from "react-bootstrap";

export default class ViewPanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            text:"",
            isChange: false,
            isSaving: false
        }
        this.onChangeText = this.onChangeText.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }
    componentDidMount(){
        ipcRenderer.on("MR_OPENFILE", (_e, fileData) => {
            this.setState({
                text: fileData.text,
                isChange: false,
                isSaving: false
            });
        });
        ipcRenderer.on("MR_SAVEFILE", (_e) => {
            this.onSaveClick(null);
        });
    }
    componentWillUnmount(){
        ipcRenderer.removeAllListeners();
    }

    onChangeText(e){
        this.setState({text: e.target.value});
        if(!this.state.isChange){
            document.title += " *";
            this.setState({isChange : true});
        }
    }
    onKeyDown(e){
        if(e.keyCode === 9){
            e.preventDefault();
            var start = e.target.selectionStart;
            var end = e.target.selectionEnd;
            var text = this.state.text;
            this.setState(
                {text: text.substring(0, start)+"\t"+text.substring(end)},
                () => {this.refs.memo.selectionStart = this.refs.memo.selectionEnd = start + 1});
        }
    }
    onSaveClick(e){
        if(e != null)e.preventDefault();
        if(this.props.dirPath === ""){
            console.log("Directory가 지정되지 않았습니다.");
        }else if(this.props.fileName === ""){
            console.log("File을 선택해주세요");
        }else{
            this.setState({isSaving: true});
            ipcRenderer.send("RM_SAVEFILE", {
                name:this.props.fileName,
                text:this.state.text
            });
            ipcRenderer.once("MR_SAVECOMPLETE", (_e) => {
                if(this.state.isChange) document.title = document.title.slice(0, -1);
                this.setState({
                    isSaving: false,
                    isChange: false
                });
            });
        }
    }

    render(){
        return(
            this.props.fileName === ""?
                <div className={layout.notOpenFile} style= {this.props.theme.empty_back}>
                    <span className={layout.notOpenFileMsg} style={this.props.theme.empty_content}>
                        <object
                            type="image/svg+xml"
                            data={require("./../images/keyword.svg")}
                            className={layout.notOpenFileImg}
                            style={this.props.theme.empty_content}
                        />
                        <br/><br/>
                        Open the text file using the list on the left.<br/>
                        If you want to create a new file,<br/>
                        click "Create TextFile" in the upper left corner.
                    </span>
                </div>
                :
                <div className= {layout.viewPanel}>
                    <textarea
                            ref="memo"
                            className={layout.memo}
                            value={this.state.text}
                            onChange={this.onChangeText}
                            onKeyDown={this.onKeyDown}
                        />
                    <Button
                            bsStyle={this.state.isChange? "primary":"default"}
                            className={layout.btnOK}
                            disabled={this.state.isSaving}
                            onClick={this.state.isSaving? null : this.onSaveClick}>
                        {this.state.isSaving? "SAVE..." : "SAVE"}
                    </Button>
                </div>
        );
    }
}