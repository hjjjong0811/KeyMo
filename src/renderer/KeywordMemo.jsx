import React from "react";
import NavPanel from "./NavPanel";
import ViewPanel from "./ViewPanel";
import layout from "./css/KeywordMemo.css";
import theme_1 from "./css/Theme_1";
import {ipcRenderer} from "electron";

export default class KeywordMemo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dirPath: "",
            selectedFile: "",
            files: [],
            allTags: [],

            theme: theme_1
        };
        this.getTagList = this.getTagList.bind(this);
        this.OnClickOpenDir = this.OnClickOpenDir.bind(this);
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

    OnClickOpenDir(){
        ipcRenderer.send("RM_OPENDIR");
    }

    renderPage(){
        if(this.state.dirPath === ""){
            return(
                <div className={layout.notOpenDir} style={this.state.theme.empty_back}>
                    <span className={layout.notOpenDirMsg} style={this.state.theme.empty_content}>
                        <object
                            type="image/svg+xml"
                            data={require("./../images/keyword.svg")}
                            className={layout.notOpenDirImg}
                            style={this.state.theme.empty_content}
                        />
                        <br/>
                        <h1>KEYMO</h1>
                        <a onClick={this.OnClickOpenDir}>
                            Open the directory
                        </a>
                    </span>
                </div>
            );
        }else{
            return(
                <div className={layout.keywordMemo}>
                    <div className={layout.navPanel}>
                        <NavPanel
                            dirPath = {this.state.dirPath}
                            selectedFile = {this.state.selectedFile}
                            files = {this.state.files}
                            allTags = {this.state.allTags}
                            id="listPanel"
                            theme = {this.state.theme}
                        />
                    </div>
                    <ViewPanel
                        dirPath = {this.state.dirPath}
                        fileName = {this.state.selectedFile}
                        id="viewPanel"
                        theme = {this.state.theme}
                    />
                </div>
            );
        }
    }

    render(){
        return(
            <div className={layout.keywordMemo}>
                {this.renderPage()}
            </div>
        );
    }
}