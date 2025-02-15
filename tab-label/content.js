// 监听来自 popup.js 的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("监听来自popup.js的消息")
    // 刷新网页
    if (request.action === "refreshLabel") {
        const existingLabel = document.querySelector('.label');
        if (existingLabel) {
            console.log("移除现有的标签")
            existingLabel.remove();
        }
        // 重新读取数据生成
        generate()
    }
    //     // 移除现有的标签
    //     const existingLabel = document.querySelector('.label');
    //     if (existingLabel) {
    //         existingLabel.remove();
    //     }
    //     // 重新加载标签
    //     chrome.storage.sync.get(['labelName', 'labelColor', 'labelPosition'], function(data) {
    //         if (data.labelName && data.labelColor) {
    //             const label = document.createElement('div');
    //             label.className = 'label';
    //             label.textContent = data.labelName;
    //             label.style.borderColor = data.labelColor;
    //             label.style.backgroundColor = data.labelColor + '33'; // semi-transparent background
    //             document.body.appendChild(label);

    //             if (data.labelPosition) {
    //                 label.style.left = data.labelPosition.x + 'px';
    //                 label.style.top = data.labelPosition.y + 'px';
    //             }

    //             let offsetX, offsetY;
    //             label.addEventListener('mousedown', function(e) {
    //                 offsetX = e.clientX - label.offsetLeft;
    //                 offsetY = e.clientY - label.offsetTop;
    //                 document.addEventListener('mousemove', mouseMoveHandler);
    //                 document.addEventListener('mouseup', mouseUpHandler);
    //             });

    //             function mouseMoveHandler(e) {
    //                 label.style.left = (e.clientX - offsetX) + 'px';
    //                 label.style.top = (e.clientY - offsetY) + 'px';
    //             }

    //             function mouseUpHandler() {
    //                 chrome.storage.sync.set({ labelPosition: { x: label.offsetLeft, y: label.offsetTop } });
    //                 document.removeEventListener('mousemove', mouseMoveHandler);
    //                 document.removeEventListener('mouseup', mouseUpHandler);
    //             }
    //         }
    //     });
    // }
});

generate()

function generate() {
    // 在 Content Script 或 Popup 中获取当前页面 URL
    const currentUrl = window.location.href;
    const parsedUrl = new URL(currentUrl);

    // 组合 hostname + pathname 作为键（示例：example.com/path/page）
    const storageKey = `${parsedUrl.hostname}${parsedUrl.pathname}`;

    console.log("storageKey2:", storageKey);

    chrome.storage.sync.get([storageKey], function (data) {
        if (!data[storageKey]) {
            console.log("没有数据")
            return
        }

        const storageValue = data[storageKey];

        console.log("加载时候获取:", storageValue.name, storageValue.color);
        const label = document.createElement('div');
        label.className = 'label';
        label.textContent = storageValue.name;
        label.style.borderColor = storageValue.color;
        label.style.backgroundColor = storageValue.color + '33';
        document.body.appendChild(label);
    })
}

// chrome.storage.sync.get(['name', 'color'], function (data) {
//     console.log("加载时候获取:", data.name, data.color);
//     // if (data.labelName && data.labelColor) {
//     //     const label = document.createElement('div');
//     //     label.className = 'label';
//     //     label.textContent = data.labelName;
//     //     label.style.borderColor = data.labelColor;
//     //     label.style.backgroundColor = data.labelColor + '33'; // semi-transparent background
//     //     document.body.appendChild(label);

//     //     if (data.labelPosition) {
//     //         label.style.left = data.labelPosition.x + 'px';
//     //         label.style.top = data.labelPosition.y + 'px';
//     //     }

//     //     let offsetX, offsetY;
//     //     label.addEventListener('mousedown', function(e) {
//     //         offsetX = e.clientX - label.offsetLeft;
//     //         offsetY = e.clientY - label.offsetTop;
//     //         document.addEventListener('mousemove', mouseMoveHandler);
//     //         document.addEventListener('mouseup', mouseUpHandler);
//     //     });

//     //     function mouseMoveHandler(e) {
//     //         label.style.left = (e.clientX - offsetX) + 'px';
//     //         label.style.top = (e.clientY - offsetY) + 'px';
//     //     }

//     //     function mouseUpHandler() {
//     //         chrome.storage.sync.set({ labelPosition: { x: label.offsetLeft, y: label.offsetTop } });
//     //         document.removeEventListener('mousemove', mouseMoveHandler);
//     //         document.removeEventListener('mouseup', mouseUpHandler);
//     //     }
//     // }
// });