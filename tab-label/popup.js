document.getElementById('labelForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const labelName = document.getElementById('labelName').value;
    const labelColor = document.getElementById('labelColor').value;

    // 处理key
    // 在 Content Script 或 Popup 中获取当前页面 URL
    const currentUrl = window.location.href;
    const parsedUrl = new URL(currentUrl);

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        const currentUrl = currentTab.url;
        const parsedUrl = new URL(currentUrl);
        const storageKey = `${parsedUrl.hostname}${parsedUrl.pathname}`;
        console.log("storageKey1:", storageKey);
        chrome.storage.sync.set({
            [storageKey]: {
                "name": labelName,
                "color": labelColor
            }
        }, function () {
            console.log('labelName:', labelName, "labelColor:", labelColor, "保存成功");
            // 发送消息给 content.js 以刷新标签
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "refreshLabel" });
            });
        });
    });
});


document.getElementById('labelForm').addEventListener('delete', function (event) {
    console.log('delete', event);
});