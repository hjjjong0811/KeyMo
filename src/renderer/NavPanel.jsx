import React from "react";
import style from "./css/NavPanel.css";
import ListItem from "./ListItem";
import {ipcRenderer} from "electron";
import FileList from "./FileList";
import {Button} from "react-bootstrap";

export default class NavPanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            //Data
            searchText: "",

            //UI
            activeTab: 1
        };

        this.OnSearchChange = this.OnSearchChange.bind(this);
        this.OnSearchClick = this.OnSearchClick.bind(this);
    }


    // * Search
    OnSearchChange(e){
        this.setState({searchText: e.target.value});
    }
    OnSearchClick(e){
        e.preventDefault();
        console.log("OnSearchClick : "+this.state.searchText);
    }
    OnTagClick(tag){
        this.setState({searchText: this.state.searchText + tag});
    }

    // * Tab Click
    onClickTab(key){
        this.setState({activeTab: key});
    }
    

    // * Render
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

                {/* File Or Tag List */}
                <div className={style.flexRemain}>
                    {/* Tab Button.. */}
                    <div>
                        <span
                            className={this.state.activeTab === 1? style.btnSimple_Selected : style.btnSimple}
                            onClick={this.onClickTab.bind(this, 1)}>
                                Files
                        </span>
                        <span
                            className={this.state.activeTab === 2? style.btnSimple_Selected : style.btnSimple}
                            onClick={this.onClickTab.bind(this, 2)}>
                                Tags
                        </span>
                    </div>
                    {/* Tab Contents */}
                    <div class={this.state.activeTab === 1?style.tab_Active:style.tab_Disable}>
                        <FileList files={this.props.files} selectedFile={this.props.selectedFile}/>
                    </div>
                    <div class={this.state.activeTab === 2?style.tab_Active:style.tab_Disable}>
                        {this.props.allTags.map(tag=>
                            <Button onClick={this.OnTagClick.bind(this, tag)}>{tag}</Button>
                            )}
                    </div>
                </div>
            </div>
        );
    }
}