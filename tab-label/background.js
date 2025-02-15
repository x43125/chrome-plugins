chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({ labelName: '', labelColor: '#ff0000', labelPosition: { x: 10, y: 10 } });
});