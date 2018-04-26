import {dialog, BrowserWindow} from "electron";
import fs from "fs";
const path = require("path");

class FileManager{
    constructor(){
        this.dirPath = "";
        this.filesInfo;
        this.searchFiles;
    }

    getTags(data){ //Get Tags using parse Text
        var tags = new Array();
        
        //find Tag in File
        var beginPos = data.indexOf("#");
        while(beginPos > -1){
            var endPos = data.indexOf(";", beginPos + 1);
            if(endPos <= -1) break;

            var bp = beginPos;
            do{
                beginPos = bp;
                bp = data.indexOf("#", beginPos + 1);
            }while(bp != -1 && bp < endPos);

            tags.push(data.substr(beginPos, endPos - beginPos + 1));
            beginPos = data.indexOf("#", endPos + 1);
        }
        return tags;
    }

    openDir(win){
        //Open Folder Dialog
        const dir = dialog.showOpenDialog(win,
            {
                title: "Open Folder",
                properties: ["openDirectory"],
            }
        );
        if(dir == null || dir.length < 1){
            return null;
        }
        this.dirPath = dir[0];
        
        //Get Info of Files in DIR
        var filesInfo = new Array();
        var i = 0;
        fs.readdirSync(this.dirPath).forEach(file => {
                if(path.extname(file) === ".txt"){
                    var data = fs.readFileSync(this.dirPath + "\\" + file, "utf8");

                    filesInfo[i] = {
                        name : file,
                        tags : this.getTags(data),
                    }
                    i++;
                }
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
        var filePath = this.dirPath + "\\" + fileName;
        if(!fs.existsSync(filePath)) return null;
        var data = fs.readFileSync(filePath, "utf8");
        return {
            name: fileName,
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
                var index = this.searchFiles.indexOf(this.filesInfo[i]);
                if(index > -1){
                    this.searchFiles[index] = {
                        name : fileData.name,
                        tags : this.getTags(data)
                    };
                }
                this.filesInfo[i] = {
                        name : fileData.name,
                        tags : this.getTags(data)
                    };
                break;
            }
        }
        return this.searchFiles;
    }
    createFile(fileName){
        const result = this.checkFileName(fileName);
        if(result != 1) return result;
        fs.writeFileSync(this.dirPath + "\\" + fileName, "", "utf8");
        for(var i=0; i<this.filesInfo.length; i++){
            if(fileName < this.filesInfo[i].name){
                this.filesInfo.splice(i, 0, {name: fileName, tags: new Array()});
                this.searchFiles = this.filesInfo;
                return this.filesInfo;
            }
        }
        this.filesInfo.push({name: fileName, tags: new Array()});
        this.searchFiles = this.filesInfo;
        return this.filesInfo;
    }
    renameFile(nameCur, nameNew){
        const result = this.checkFileName(nameNew);
        if(result != 1) return result;

        fs.renameSync(this.dirPath + "\\" + nameCur, this.dirPath + "\\" + nameNew);

        var index_files = this.filesInfo.findIndex(function(e){
                return e.name === nameCur;
            });
        this.filesInfo[index_files].name = nameNew;
        this.filesInfo.sort(function(a, b){
            return a.name < b.name ? -1 : a.name > b.name ? 1:0;
        });

        var index_search = this.searchFiles.indexOf(this.filesInfo[index_files]);
        if(index_search > -1){
            this.searchFiles[index_search].name = nameNew;
        }
        this.searchFiles.sort(function(a, b){
            return a.name < b.name ? -1 : a.name > b.name ? 1:0;
        });

        return this.filesInfo;
    }
    deleteFile(fileName){
        var filePath = this.dirPath + "\\" + fileName;
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
        }
        var index = this.filesInfo.findIndex(function(e){
            return e.name === fileName;
        });
        if(index != -1) this.filesInfo.splice(index, 1);

        index = this.searchFiles.findIndex(function(e){
            return e.name === fileName;
        });
        if(index != -1) this.searchFiles.splice(index, 1);
        return {
            fileName: fileName,
            filesInfo: this.searchFiles
        };
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

    checkFileName(fileName){  
        var regex = /^[^\/\\:*?"<>|;,]{1,200}(\.txt)$/;
        if(!regex.test(fileName)) {
            return -1;
        }
        if(fs.existsSync(this.dirPath + "\\" + fileName)){
            return 0;
        }
        return 1;
    }
}

function createFileManager(){
    return new FileManager();
}
export default createFileManager;