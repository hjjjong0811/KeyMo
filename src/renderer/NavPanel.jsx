import React from "react";
import {Popover, Overlay, Button, FormControl, Form,
            Tabs, Tab, ListGroup} from "react-bootstrap";
import style from "./css/NavPanel.css";
import ListItem from "./ListItem";
import {ipcRenderer} from "electron";

export default class NavPanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            //Data
            newFileName: "",
            searchText: "",

            //UI
            isOpenCreate: false,
            activeTab: 1
        };

        this.OnSearchChange = this.OnSearchChange.bind(this);
        this.OnSearchClick = this.OnSearchClick.bind(this);

        this.CreateWin_Toggle = this.CreateWin_Toggle.bind(this);
        this.OnFileNameChange = this.OnFileNameChange.bind(this);
        this.OnCreateWin_OKClick = this.OnCreateWin_OKClick.bind(this);

        this.onClickTab = this.onClickTab.bind(this);
    }


    // * Search
    OnSearchChange(e){
        this.setState({searchText: e.target.value});
    }
    OnSearchClick(e){
        e.preventDefault();
        console.log("OnSearchClick : "+this.state.searchText);
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

    // * Tab Click
    onClickTab(key){
        this.setState({activeTab: key});
    }
    

    // * Render
    renderFileList(){
        return(
            <ListGroup>
                {this.props.files.map(f=>
                    <ListItem
                        txtInfo={f}
                        selected={f.name === this.props.selectedFile}
                        onClickItem={this.onClickFile.bind(this, f.name)}/>
                    )}
            </ListGroup>
        );
    }
    renderTabList(){
        return(
            <div>
                taglist
            </div>
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
                <div>
                    <button className={style.dirBtn}/>
                    <strong>{this.props.dirPath}</strong>
                </div>

                {/* SearchPanel */}
                <div>
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
                <div className={style.flexRemain}>
                    <Tabs
                        activeKey={this.state.activeTab}
                        onSelect={this.onClickTab}
                    >
                        <Tab eventKey={1} title="FileList">
                            <Button onClick={this.CreateWin_Toggle}>Create TextFile</Button>
                            <Overlay
                                show={this.state.isOpenCreate}
                                target={this.state.target}
                                placement="right">
                                    {this.renderCreatePopup()}
                            </Overlay>
                            <div className={style.scrollBox}>
                                {this.renderFileList()}
                            </div>
                        </Tab>
                        <Tab eventKey={2} title="Tags">
                            {this.renderTabList()}
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}