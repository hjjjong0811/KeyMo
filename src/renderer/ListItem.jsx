import React from "react";
import { ListGroupItem } from "react-bootstrap";
import ContextMenu from "./ContextMenu";

export default class ListItem extends React.Component {
  constructor(props){
    super(props);
    this.toStringTag = this.toStringTag.bind(this);
    this.test = this.test.bind(this);
  }
  toStringTag(tags) {
    if (tags.length > 10) {
      return tags.slice(0, 10).join(' ') + "...";
    } else {
      return tags.join(' ');
    }
  }
  test(){
    console.log("test~~~");
  }

  render() {
    return (
      <div>
        <ListGroupItem
          id={this.props.txtInfo.name}
          onClick={this.props.onClickItem}
          active={this.props.selected}
        >
          {this.props.txtInfo.name}<br />
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
              onSelect: this.test
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
