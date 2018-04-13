import React from "react";
import style from "./css/ViewPanel.css";
import {ipcRenderer} from "electron";

export default class ViewPanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            text:""
        }
        this.onChangeText = this.onChangeText.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }
    componentDidMount(){
        ipcRenderer.on("MR_OPENFILE", (_e, fileData) => {
            this.setState({text: fileData.text});
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
            ipcRenderer.send("RM_SAVEFILE", {
                name:this.props.fileName,
                text:this.state.text
            });
        }
    }

    render(){
        return(
            <div className= {style.viewPanel}>
                <textarea
                        ref="memo"
                        className={style.memo}
                        value={this.state.text}
                        onChange={this.onChangeText}
                        onKeyDown={this.onKeyDown}
                    />
                <button type="button"
                        className={style.btnOK}
                        onClick={this.onSaveClick}>
                    SAVE
                </button>
            </div>
        );
    }
}