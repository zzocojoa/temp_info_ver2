const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // 필요 시 preload.js 파일 경로 추가
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
        }
    });

    const startUrl = path.join(__dirname, 'client', 'build', 'index.html');
    mainWindow.loadFile(startUrl);

    mainWindow.webContents.openDevTools();
}

app.on('ready', () => { // 'ready' 이벤트 사용
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    // 서버 실행 로직
    exec('node server/app.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`Server stdout: ${stdout}`);
        console.error(`Server stderr: ${stderr}`);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
