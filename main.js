// main.js

const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            // preload 스크립트가 없으면 preload 옵션을 제거하세요.
        }
    });

    // `hash`를 사용하는 라우팅을 위해 `index.html`을 로드합니다.
    mainWindow.loadFile(path.join(__dirname, 'client/build/index.html'));

    // 개발자 도구를 열지 않아도 되는 경우 아래 줄을 주석 처리하거나 제거하세요.
    mainWindow.webContents.openDevTools();

    // 페이지 리디렉션을 처리하는 로직을 제거할 수 있습니다.
    // 이는 HashRouter와 충돌을 일으킬 수 있습니다.
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    // 서버 로직은 그대로 유지합니다.
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
