import createFileManager from "./createFileManager";
const {app, Menu, BrowserWindow, webContents, ipcMain, shell} = require("electron");
const path = require("path");
const url = require("url");

let win;
let fileManager;

function openDirectory(){
    const dirInfo = fileManager.openDir(win);
    if(dirInfo != null) win.webContents.send("MR_OPENDIR", dirInfo);
}
function openFile(fileName){
    const fileData = fileManager.openFile(fileName);
    if(fileData == null){}
    else{win.webContents.send("MR_OPENFILE", fileData);}
}
function saveFile(fileData){
    const filesInfo = fileManager.saveFile(fileData);
    win.webContents.send("MR_UPDATETAGS", filesInfo);
    win.webContents.send("MR_SAVECOMPLETE");
}
function createFile(fileName){
    const filesInfo = fileManager.createFile(fileName);
    if(filesInfo == 0) win.webContents.send("MR_ISNEWCOMPLETE", 0);
    else if(filesInfo == -1) win.webContents.send("MR_ISNEWCOMPLETE", -1);
    else{
        win.webContents.send("MR_UPDATETAGS", filesInfo);
        win.webContents.send("MR_ISNEWCOMPLETE", 1);
    }
}
function searchFile(searchText){
    const result = fileManager.searchFile(searchText);
    win.webContents.send("MR_UPDATETAGS", result);
}

function createWindow(){
    win = new BrowserWindow({width: 800, height: 600});
    win.loadURL('file://' + __dirname + '/../../index.html');
    win.on("closed", () => {
        win = null;
    });
    win.webContents.on("will-navigate", (e, url) => {
        e.preventDefault();
        shell.openExternal(url);
    });
}
function renameFile(nameCur, nameNew){
    const result = fileManager.renameFile(nameCur, nameNew);
    if(result == 0 || result == -1) win.webContents.send("MR_ISRENAMECOMPLETE", result);
    else{
        win.webContents.send("MR_UPDATETAGS", result);
        win.webContents.send("MR_ISRENAMECOMPLETE", 1);
        win.webContents.send("MR_RENAMEFILE", nameCur, nameNew);
    }
}
function deleteFile(fileName){
    const filesInfo = fileManager.deleteFile(fileName);
    win.webContents.send("MR_DELETEFILE", filesInfo);
}

function setAppMenu(){
    const template =[
        {
            label: "File",
            submenu: [
                {label: "Open Directory", accelerator: "CmdOrCtrl+O", click: ()=> openDirectory()},
                {label: "Save", accelerator: "CmdOrCtrl+S", click: ()=> win.webContents.send("MR_SAVEFILE")},
                {label: "Exit", role: "close"}
            ]
        },

        {
            label: "Edit",
            submenu: [
                {label: "Copy", accelerator: "CmdOrCtrl+C", role: "copy"},
                {label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste"},
                {label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut"},
                {label: "Select All", accelerator: "CmdOrCtrl+A", role: "selectall"}
            ]
        },

        {
            label: "View",
            submenu: [
                {role: "zoomin"},
                {role: "zoomout"},
                {role: "resetzoom"},
                {type: "separator"},
                {role: "togglefullscreen"},
                {label: "Toggle DevTools", accelerator: "F12",
                    click: ()=> BrowserWindow.getFocusedWindow().toggleDevTools()}
            ]
        },

        {
            label: "Help",
            submenu: [
                {label: "About", click: ()=>win.webContents.send("MR_MODAL_ABOUT")}
            ]
        }
    ];

    if(process.platform === "darwin"){
        template.unshift(
            {
                label: app.getName(),
                submenu: [
                ]
            }
        );
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.on("ready", () =>{
    createWindow();
    setAppMenu();
    fileManager = createFileManager();
    ipcMain.on("RM_OPENDIR", (_e) => openDirectory());
    ipcMain.on("RM_OPENFILE", (_e, fileName) => openFile(fileName));
    ipcMain.on("RM_SAVEFILE", (_e, fileData) => saveFile(fileData));
    ipcMain.on("RM_NEWFILE", (_e, fileName) => createFile(fileName));
    ipcMain.on("RM_SEARCHFILE", (_e, searchText) => searchFile(searchText));
    ipcMain.on("RM_RENAMEFILE", (_e, nameCur, nameNew) => renameFile(nameCur, nameNew));
    ipcMain.on("RM_DELETEFILE", (_e, fileName) => deleteFile(fileName));
});

app.on("window-all-closed", () =>{
    if(process.platform !== "darwin"){
        app.quit();
    }
});

app.on("activate", () =>{
    if(win === null){
        createWindow();
    }
})