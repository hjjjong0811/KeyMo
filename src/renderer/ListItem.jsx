import React from "react";
import style from "./css/ListItem.css";

function toStringTag(tags){
  if(tags.length > 5){
    return tags.slice(0, 5).join('; ') + "...";
  }else{
    return tags.join('; ');
  }
}

export default function ListItem(props) {
    const { selected } = props;
    const { name, tags } = props.txtInfo;
    return (
      <div className={selected ? style.FileListItem_selected : style.FileListItem}
          onClick={props.onClick}>
        <div className={style.FileName}>{name}</div>
        <div className={style.FileTags}>{toStringTag(tags)}</div>
      </div>
    );
  }
  