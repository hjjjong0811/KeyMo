import {dialog} from "electron";
import fs from "fs";
const path = require("path");

class FileManager{
    constructor(){
        this.dirPath = "";
        this.filesInfo;
        this.fileName = "";
        this.searchFiles;
    }

    getTags(data){ //Get Tags using parse Text
        var tags = new Array();
        
        //find Tag in File
        var beginPos = data.indexOf("#");
        while(beginPos > -1){
            var endPos = data.indexOf(";", beginPos + 1);
            if(endPos <= -1) break;
            tags.push(data.substr(beginPos, endPos - beginPos + 1));
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
        if(dir == null || dir.length < 1){
            return null;
        }
        this.dirPath = dir[0];
        this.fileName = "";
        
        //Get Info of Files in DIR
        var filesInfo = new Array();
        var i = 0;
        fs.readdirSync(this.dirPath).forEach(file => {
            if(path.extname(file) === ".txt"){
                //Open File
                try{
                    var data = fs.readFileSync(this.dirPath + "\\" + file, "utf8");
                }catch(err){
                    console.log("fileManager : openDir() : "+err);
                    return;
                }
                filesInfo[i] = {
                    name : file,
                    tags : this.getTags(data),
                }
            }
            i++;
            }
        );
        this.filesInfo = filesInfo;
        this.searchFiles = this.filesInfo;

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
                this.searchFiles[this.searchFiles.indexOf(this.filesInfo[i])] =
                    this.filesInfo[i] = {
                        name : fileData.name,
                        tags : this.getTags(data)
                }
                break;
            }
        }
        console.log("save complete");
        return this.searchFiles;
    }
    createFile(fileName){
        fs.writeFileSync(this.dirPath + "\\" + fileName, '',);
        for(var i=0; i<this.filesInfo.length; i++){
            if(fileName < this.filesInfo[i].name){
                this.filesInfo.splice(i, 0, {name: fileName, tags: new Array()});
                return this.filesInfo;
            }
        }
        this.filesInfo.push({name: fileName, tags: new Array()});
        this.searchFiles = this.filesInfo;
        return this.filesInfo;
    }
    searchFile(searchText){
        if(searchText === ""){
            this.searchFiles = this.filesInfo;
            return this.filesInfo;
        }
        var searchTags = this.getTags(searchText);

        var filesResult = new Array();

        for(var i=0; i<this.filesInfo.length; i++){
            //Contain All searchTag?
            var bTagPlag = 0;
            for(var j=0; j<searchTags.length; j++){
                if(this.filesInfo[i].tags.indexOf(searchTags[j]) != -1){
                    bTagPlag++;
                    continue;
                }
            }
            if(bTagPlag < searchTags.length) continue;

            filesResult.push(this.filesInfo[i]);
        }
        this.searchFiles = filesResult;
        return this.searchFiles;
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