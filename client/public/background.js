chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // 비동기 작업을 시작합니다.
    someAsyncFunction().then(result => {
        // 비동기 작업이 성공적으로 완료되면 응답을 보냅니다.
        sendResponse({success: true, data: result});
    }).catch(error => {
        // 에러가 발생하면 에러 응답을 보냅니다.
        sendResponse({success: false, error: error.toString()});
    });

    // 비동기 응답을 반환할 예정이므로 true를 반환합니다.
    return true; 
});