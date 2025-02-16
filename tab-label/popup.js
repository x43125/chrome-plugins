document.getElementById('labelForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const labelName = document.getElementById('labelName').value;
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


document.getElementById('labelForm').addEventListener('delete', function (event) {
    console.log('delete', event);
});