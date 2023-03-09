chrome.contextMenus.create({
    id: "speedread",
    title: "Speedread",
    contexts: ["selection"],
});

chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId == "speedread") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            speedread(info.selectionText, tabs[0].id);
        });
    }
});

function speedread(text, tabId) {
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        args: [text],
        function: (text) => {
            let div = document.createElement('div');
            div.setAttribute('id', 'sr-main');
            div.style.position = 'fixed';
            div.style.display = 'grid';
            div.style.placeItems = 'center';
            div.style.width = '50vw';
            div.style.height = '50vh';
            div.style.top = '50%';
            div.style.left = '50%';
            div.style.transform = 'translate(-50%, -50%)';
            div.style.backgroundColor = 'hsl(0, 0%, 10%)';
            div.style.zIndex = '99999';
            div.style.borderRadius = '10px';
            body.appendBefore(div, body.firstChild);
        }
    });
}