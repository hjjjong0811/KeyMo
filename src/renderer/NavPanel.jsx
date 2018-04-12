import React from "react";
import style from "./css/NavPanel.css";
import ListItem from "./ListItem";
import {ipcRenderer} from "electron";

export default class NavPanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            searchText: ""
        };
        this.OnSearchChange = this.OnSearchChange.bind(this);
        this.OnSearchClick = this.OnSearchClick.bind(this);
    }


    OnSearchChange(e){
        this.setState({searchText: e.target.value});
    }
    OnSearchClick(e){
        e.preventDefault();
        console.log("OnSearchClick : "+this.state.searchText);
    }

    onClickFile(fileName){
        ipcRenderer.send("RM_OPENFILE", fileName);
    }

    renderFileList(){
        return(
            <div>
                <button>Add TextFile</button>
                {this.props.files.map(f=><ListItem txtInfo={f} selected={f.name === this.props.selectedFile}
                            onClick={this.onClickFile.bind(this, f.name)}/>)}
            </div>
        )
    }

    render(){
        return(
            <div className={style.navPanel}>
                <div className={style.dirPanel}>
                    <button className={style.dirBtn}/>
                    <strong>{this.props.dirPath}</strong>
                </div>

                {/* SearchPanel */}
                <div className={style.searchPanel + " searchPanel"}>
                    <form onSubmit={this.OnSearchClick}>
                        <input type="text"
                            value={this.state.searchText}
                            className={style.searchText}
                            onChange={this.OnSearchChange}/>
                        <button className={style.searchBtn}/>
                    </form>
                </div>
                <hr width="100%"/>

                {/* FileList */}
                <div className={style.listPanel}>
                    {this.renderFileList()}
                </div>
            </div>
        );
    }
}