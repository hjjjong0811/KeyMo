import React from "react";
import layout from "./css/NavPanel.css";
import {ipcRenderer} from "electron";
import FileList from "./FileList";
import {Button,FormControl, Form} from "react-bootstrap";

export default class NavPanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            //Data
            searchText: "",

            //UI
            activeTab: 1
        };

        this.OnClickOpenDir = this.OnClickOpenDir.bind(this);
        this.OnClickViewAllFile = this.OnClickViewAllFile.bind(this);

        this.OnSearchChange = this.OnSearchChange.bind(this);
        this.OnSearchClick = this.OnSearchClick.bind(this);
    }

    //Nav Button
    OnClickOpenDir(){
        ipcRenderer.send("RM_OPENDIR");
    }
    OnClickViewAllFile(){
        this.setState({searchText: ""});
        ipcRenderer.send("RM_SEARCHFILE", "");
    }

    // * Search
    OnSearchChange(e){
        this.setState({searchText: e.target.value});
    }
    OnSearchClick(e){
        e.preventDefault();
        ipcRenderer.send("RM_SEARCHFILE", this.state.searchText);
    }
    OnTagClick(tag){
        this.setState({searchText: this.state.searchText + tag});
    }

    // * Tab Click
    onClickTab(key){
        this.setState({activeTab: key});
    }
    

    // * Render
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
            <div className={layout.verticalFlex}>
                <div className={layout.searchPanel} style={this.props.theme.container_1}>
                    {/* Quick Icon */}
                    <img
                        src={require("./../images/folder.svg")}
                        className={layout.icon}
                        onClick={this.OnClickOpenDir}/>
                    <img
                        src={require("./../images/house.svg")}
                        className={layout.icon}
                        onClick={this.OnClickViewAllFile}/>
                    {/* Search */}
                    <Form inline className={layout.searchPanel + " " + layout.remain} onSubmit={this.OnSearchClick} style={{background: "inherit"}}>
                        <FormControl
                            type="text"
                            placeholder="Search Tag"
                            value={this.state.searchText}
                            className={layout.searchText + " " + layout.remain}
                            onChange={this.OnSearchChange}/>
                            <input
                                type="image"
                                src={require("./../images/magnifying-glass.svg")}
                                className={layout.icon}
                                alt="Submit"/>
                    </Form>
                </div>

                {/* File Or Tag List */}
                <div className={layout.flexRemain}>
                    {/* Tab Button.. */}
                    <div>
                        <span
                            className={this.state.activeTab === 1? layout.btnSimple_Selected : layout.btnSimple}
                            onClick={this.onClickTab.bind(this, 1)}>
                                Files
                        </span>
                        <span
                            className={this.state.activeTab === 2? layout.btnSimple_Selected : layout.btnSimple}
                            onClick={this.onClickTab.bind(this, 2)}>
                                Tags
                        </span>
                    </div>
                    {/* Tab Contents */}
                    <div class={this.state.activeTab === 1?layout.tab_Active:layout.tab_Disable}>
                        <FileList files={this.props.files} selectedFile={this.props.selectedFile}/>
                    </div>
                    <div class={this.state.activeTab === 2?layout.tab_Active:layout.tab_Disable}>
                        <div className={layout.prSize_scroll}>
                            {this.props.allTags.map(tag=>
                                <Button onClick={this.OnTagClick.bind(this, tag)}>{tag}</Button>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}