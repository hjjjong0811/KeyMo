import React from "react";
import style from "./css/ListItem.css";

export default function ListItem(props) {
    const { selected } = props;
    const { name, tags } = props.txtInfo;
    return (
      <div className={selected ? style.FileListItem_selected : style.FileListItem}
          onClick={props.onClick}>
        {name}<br/>
        {tags}
        <hr/>
      </div>
    );
  }
  