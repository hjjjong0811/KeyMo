import React from "react";
import NavPanel from "./NavPanel";
import ViewPanel from "./ViewPanel";
import style from "./css/KeywordMemo.css";
import {ipcRenderer} from "electron";

export default class KeywordMemo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dirPath: "",
            selectedFile: "",
            files: [],
            Tags: []
        };
    }
    componentDidMount(){
        ipcRenderer.on("MR_OPENDIR", (_e, dirInfo) => {
            document.title = "KeyMo - " + dirInfo.dirPath;
            this.setState({
                dirPath: dirInfo.dirPath,
                selectedFile: "",
                files: dirInfo.filesInfo
            });
        });
        ipcRenderer.on("MR_OPENFILE", (_e, fileData) => {
            document.title = "KeyMo - " + this.state.dirPath + " : " + fileData.name;
            this.setState({
                selectedFile: fileData.name
            });
        });
        ipcRenderer.on("MR_UPDATETAGS", (_e, filesInfo) => {
            this.setState({
                files: filesInfo
            });
        });
    }
    componentWillUnmount(){
        ipcRenderer.removeAllListeners();
    }

    getTagList(files){
    }

    render(){
        return(
            <div className={style.keywordMemo}>
            <NavPanel
                className={style.listPanel}
                dirPath = {this.state.dirPath}
                selectedFile = {this.state.selectedFile}
                files = {this.state.files}
                id="listPanel"/>
            <ViewPanel
                className={style.viewPanel}
                dirPath = {this.state.dirPath}
                fileName = {this.state.selectedFile}
                id="viewPanel"/>
            </div>
        );
    }
}