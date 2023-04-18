function addButton() {
  const videoControls = document.querySelector('.ytp-chrome-controls');
  if (!videoControls) return;

  const button = document.createElement('button');
  button.textContent = 'Detect';
  button.style.cssText = 'margin-left: 8px; margin-bottom : 4px; margin-right:2px;cursor: pointer;';
  button.addEventListener('click', () => {
    const videoURL = window.location.href;
    console.log(videoURL);
    chrome.runtime.sendMessage({ action: 'updateLink', link: videoURL,type:'video' });
  });
  videoControls.paddingBottom = '10px';
  videoControls.appendChild(button);
}

addButton();
