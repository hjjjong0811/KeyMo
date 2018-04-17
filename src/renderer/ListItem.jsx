import React from "react";
import { ListGroupItem, Form, FormControl, Overlay, Tooltip } from "react-bootstrap";
import ContextMenu from "./ContextMenu";
import { ipcRenderer } from "electron";

export default class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNaming: false,
      renameText: this.props.txtInfo.name.slice(0, -4),
      isOpenTooltip_rename: false,
      renameTooltip: ""
    }
    this.onClickListener = this.onClickListener.bind(this);
    this.toStringTag = this.toStringTag.bind(this);

    this.contextRename = this.contextRename.bind(this);
    this.onRenameChange = this.onRenameChange.bind(this);
    this.renameFileSubmit = this.renameFileSubmit.bind(this);

  }
  onClickListener(e){
    if(this.container && !this.container.contains(e.target)){
      this.setState({isNaming: false});
    }
  }
  componentDidMount() {
    document.addEventListener("contextmenu", this.onClickListener);
    document.addEventListener("click", this.onClickListener);
  }
  componentWillUnmount() {
    document.removeEventListener("contextmenu", this.onClickListener);
    document.removeEventListener("click", this.onClickListener);
  }


  toStringTag(tags) {
    if (tags.length > 10) {
      return tags.slice(0, 10).join(' ') + "...";
    } else {
      return tags.join(' ');
    }
  }


  // ** Rename
  contextRename() {
    this.setState({ isNaming: true, renameText: this.props.txtInfo.name.slice(0, -4) });
  }
  onRenameChange(e) {
    this.setState({
      renameText: e.target.value,
      target_form: e.target,
      isOpenTooltip_rename: false
    });
  }
  renameFileSubmit(e) {
    e.preventDefault();
    if (this.props.txtInfo.name === this.state.renameText + ".txt") {
      this.setState({
        isNaming: false
      });
      return;
    }
    ipcRenderer.send("RM_RENAMEFILE", this.props.txtInfo.name, this.state.renameText + ".txt");
    ipcRenderer.once("MR_ISRENAMECOMPLETE", (_e, result) => {
      if (result == 1) {
        this.setState({
          isNaming: false
        });
      }
      else if(result==0){
          this.setState({
              isOpenTooltip_rename: true,
              renameTooltip: "이미 존재하는 파일명입니다"
          });
          setTimeout(function(){
              this.setState({isOpenTooltip_rename: false})}.bind(this), 2000);
      }else if(result==-1){
          this.setState({
              isOpenTooltip_rename: true,
              renameTooltip: "파일 이름에는 \\ / : * ? \" < > | 의 문자를 사용할 수 없습니다"
          });
          setTimeout(function(){
              this.setState({isOpenTooltip_rename: false})}.bind(this), 2000);
      }
    });
  }

  renderRename(){
    return(
        <Form inline onSubmit={this.renameFileSubmit}>
          <FormControl
            type="text"
            value={this.state.renameText}
            placeholder="Enter New Name"
            onChange={this.onRenameChange}
            onClick="#"
          />
          <Overlay
            container= {this}
            target= {this.state.target_form}
            show={this.state.isOpenTooltip_rename}
            placement="top">
            <Tooltip id="fileNametooltip">{this.state.renameTooltip}</Tooltip>
          </Overlay>
        </Form>
    );
  }

  render() {
    return (
      <div ref={(container)=> this.container = container}>
        <ListGroupItem
          id={this.props.txtInfo.name}
          onClick={this.props.onClickItem}
          active={this.props.selected}
        >
          {this.state.isNaming ? this.renderRename() : this.props.txtInfo.name}<br />
          {this.toStringTag(this.props.txtInfo.tags)}
        </ListGroupItem>
        <ContextMenu
          ID={this.props.txtInfo.name}
          menuList={[
            {
              label: "Open",
              onSelect: this.props.onClickItem
            },
            {
              label: "ReName",
              onSelect: this.contextRename
            },
            {
              label: "Delete",
              onSelect: this.test
            }
          ]}
        />
      </div>
    );
  }
}
