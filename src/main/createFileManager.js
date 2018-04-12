import {dialog} from "electron";
import fs from "fs";
const path = require("path");

class FileManager{
    constructor(){
        this.dirPath = "";
        this.filesInfo;
        this.fileName = "";
    }

    getTags(fileName){ //Get Tags using parse Text of file
        var tags = new Array();

        //Open File
        try{
            var data = fs.readFileSync(this.dirPath + "\\" + fileName, "utf8");
        }catch(err){
            console.log(err);
            return;
        }
        
        //find Tag in File
        var beginPos = data.indexOf("#");
        while(beginPos > -1){
            var endPos = data.indexOf(";", beginPos + 1);
            if(endPos <= -1) break;
            tags.push(data.substr(beginPos + 1, endPos - beginPos - 1));
            beginPos = data.indexOf("#", endPos + 1);
        }
        return tags;
    }

    openDir(){
        //Open Folder Dialog
        const dir = dialog.showOpenDialog(
            {
                title: "Open Folder",
                properties: ["openDirectory"],
            }
        );
        this.dirPath = dir[0];
        this.fileName = "";
        
        //Get Info of Files in DIR
        var filesInfo = new Array();
        var i = 0;
        fs.readdirSync(this.dirPath).forEach(file => {
            if(path.extname(file) === ".txt"){
                filesInfo[i] = {
                    name : file,
                    tags : this.getTags(file),
                }
            }
            i++;
            }
        );
        this.filesInfo = filesInfo;

        return {
            dirPath : this.dirPath,
            filesInfo : this.filesInfo
        };
    }
    openFile(fileName){
        //file Open, text전달
        this.fileName = fileName;
        //Open File
        try{
            var data = fs.readFileSync(this.dirPath + "\\" + fileName, "utf8");
        }catch(err){
            console.log(err);
            return;
        }
        return {
            name: this.fileName,
            text: data
        };
    }
    saveFile(fileData){
        var data = fileData.text;
        if(process.platform === "win32") {
            data = fileData.text.replace(/\n/g, "\r\n");
        }
        fs.writeFileSync(this.dirPath + "\\" + fileData.name, data, "utf8");
        for(var i=0; i<this.filesInfo.length; i++){
            if(this.filesInfo[i].name === fileData.name){
                this.filesInfo[i] = {
                    name : fileData.name,
                    tags : this.getTags(fileData.name)
                }
                break;
            }
        }
        console.log("save complete");
        return this.filesInfo;
    }
    createFile(fileName){
        fs.writeFileSync(this.dirPath + "\\" + fileName, '',);
        for(var i=0; i<this.filesInfo.length; i++){
            if(fileName < this.filesInfo[i].name){
                this.filesInfo.splice(i, 0, {name: fileName, tags: new Array()});
                console.log("createFile(): sandwich");
                return this.filesInfo;
            }
        }
        this.filesInfo.push({name: fileName, tags: new Array()});
        console.log("createFile(): end");
        return this.filesInfo;
    }

    showOpenDirDialog(){
        return new Promise( (resolve, reject) => {
            const files = dialog.showOpenDialog(
                {
                    title: "Open Folder",
                    properties: ["openDirectory"],
                }
            );

        })
    }


}

function createFileManager(){
    return new FileManager();
}
export default createFileManager;