document.getElementById('labelForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const labelName = document.getElementById('labelName').value;
    if (!labelName) {
        alert('标签名不能为空');
        return;
    }

    const labelColor = document.getElementById('labelColor').value;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        const currentUrl = currentTab.url;
        const parsedUrl = new URL(currentUrl);
        const storageKey = `${parsedUrl.hostname}${parsedUrl.pathname}`;
        chrome.storage.sync.get([storageKey], function (data) {
            const updatedData = data[storageKey] || {};
            updatedData.name = labelName;
            updatedData.color = labelColor;
            if (!updatedData.position) {
                updatedData.position = { x: 10, y: 10 }
            }
            chrome.storage.sync.set({ [storageKey]: updatedData }, function () {
                // 发送消息给 content.js 以刷新标签
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "refreshLabel" });
                });
            });
        });
    });
});

document.getElementById('deleteLabel').addEventListener('click', function (event) {
    // 获取当前标签的URL
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        const currentUrl = currentTab.url;
        const parsedUrl = new URL(currentUrl);
        const storageKey = `${parsedUrl.hostname}${parsedUrl.pathname}`;
        // 移除
        chrome.storage.sync.remove([storageKey], function () {
            // 发送消息给 content.js 以刷新标签
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "refreshLabel" });
            });
        });
    })
});