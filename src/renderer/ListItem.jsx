import React from "react";
import {ListGroupItem} from "react-bootstrap";

function toStringTag(tags){
  if(tags.length > 10){
    return tags.slice(0, 10).join('; ') + "...";
  }else{
    return tags.join('; ');
  }
}

export default function ListItem(props) {
    const { name, tags } = props.txtInfo;
    return (
      <ListGroupItem
          onClick={props.onClickItem}
          active={props.selected}
        >
          {name}<br/>
          {toStringTag(tags)}
      </ListGroupItem>
    );
  }
  