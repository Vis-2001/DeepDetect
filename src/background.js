chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'detect',
    title: 'Detect',
    contexts: ['image'],
    type: 'normal',
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'detect') {
    chrome.runtime.sendMessage({ action: 'updateLink', link: info.srcUrl,type:'image' });
  }
});
