import React from "react";
import { ListGroupItem, Overlay, Tooltip } from "react-bootstrap";
import ContextMenu from "./ContextMenu";
import { ipcRenderer } from "electron";
import layout from "./css/ListItemStyle.css";

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
    this.preventEvent = this.preventEvent.bind(this);

    this.contextRename = this.contextRename.bind(this);
    this.onRenameChange = this.onRenameChange.bind(this);
    this.renameFileSubmit = this.renameFileSubmit.bind(this);

    this.onDelete = this.onDelete.bind(this);
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

  preventEvent(e){
    e.stopPropagation();
  }
  
  // ** Rename
  contextRename() {
    this.setState({ isNaming: true, renameText: this.props.txtInfo.name.slice(0, -4) });
  }
  onRenameChange(e) {
    this.setState({
      renameText: e.target.value,
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

  // ** Delete
  onDelete(){
    ipcRenderer.send("RM_DELETEFILE", this.props.txtInfo.name);
  }

  renderRename(){
    return(
        <form onSubmit={this.renameFileSubmit}
          style={this.props.selected? this.props.theme.container_2 : this.props.theme.container_3}>
          <input
            type="text"
            value={this.state.renameText}
            placeholder="Enter New Name"
            onChange={this.onRenameChange}
            onClick={this.preventEvent}
            style={{width: "100%"}}
          />
          <Overlay
            target= {this}
            show={this.state.isOpenTooltip_rename}
            placement="right">
            <Tooltip id="fileNametooltip">{this.state.renameTooltip}</Tooltip>
          </Overlay>
        </form>
    );
  }

  render() {
    return (
      <div ref={(container)=> this.container = container}>
        <ListGroupItem
          id={this.props.txtInfo.name}
          onClick={this.props.onClickItem}
          ref={(target_form)=> this.target_form = target_form}
          style={this.props.selected? this.props.theme.container_2 : this.props.theme.container_3}
        >
          {this.state.isNaming ? this.renderRename() :
             <h4 className={layout.txtSubject}>{this.props.txtInfo.name}</h4>}
          <h6 className={layout.txtTags}>{this.toStringTag(this.props.txtInfo.tags)}</h6>
        </ListGroupItem>
        <ContextMenu
          ID={this.props.txtInfo.name}
          container={this.container}
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
              onSelect: this.onDelete
            }
          ]}
        />
      </div>
    );
  }
}
