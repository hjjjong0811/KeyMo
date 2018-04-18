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
            allTags: []
        };
        this.getTagList = this.getTagList.bind(this);
    }
    componentDidMount(){
        ipcRenderer.on("MR_OPENDIR", (_e, dirInfo) => {
            document.title = "KeyMo - " + dirInfo.dirPath;
            this.setState({
                dirPath: dirInfo.dirPath,
                selectedFile: "",
                files: dirInfo.filesInfo
            });
            this.getTagList();
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
            this.getTagList();
        });
        ipcRenderer.on("MR_RENAMEFILE", (_e, nameCur, nameNew) => {
            if(this.state.selectedFile === nameCur) this.setState({selectedFile: nameNew});
            document.title = document.title.replace(nameCur, nameNew);
        });
        ipcRenderer.on("MR_DELETEFILE", (_e, data) => {
            if(this.state.selectedFile === data.fileName){
                this.setState({
                    selectedFile: ""
                });
                document.title = "KeyMo - " + this.state.dirPath;
            }
            this.setState({
                files: data.filesInfo
            });
            this.getTagList();
        })
    }
    componentWillUnmount(){
        ipcRenderer.removeAllListeners();
    }

    getTagList(){
        var tags = new Array();
        for(var i=0; i<this.state.files.length; i++){
            tags = tags.concat(this.state.files[i].tags).reduce(function(uniques, item){
                if(uniques.indexOf(item) == -1) uniques.push(item);
                return uniques;
            }, []);
        }
        this.setState({allTags: tags});
    }

    renderPage(){
        if(this.state.dirPath === ""){
            return(
                <div>
                    Please Open Directory
                </div>
            );
        }else{
            return(
                <div className={style.keywordMemo}>
                    <div className={style.navPanel}>
                        <NavPanel
                            dirPath = {this.state.dirPath}
                            selectedFile = {this.state.selectedFile}
                            files = {this.state.files}
                            allTags = {this.state.allTags}
                            id="listPanel"/>
                    </div>
                    <ViewPanel
                        dirPath = {this.state.dirPath}
                        fileName = {this.state.selectedFile}
                        id="viewPanel"/>
                </div>
            );
        }
    }

    render(){
        return(
            <div className={style.keywordMemo}>
                {this.renderPage()}
            </div>
        );
    }
}