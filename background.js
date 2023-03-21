init = (tab) => {
  const {id, url} = tab;
  chrome.scripting.executeScript(
    {
      target: {tabId: id, allFrames: true},
      files: ['jquery.min.js','clientside.js']
    }
  )
  console.log(`downloaded !`); 
}

chrome.action.onClicked.addListener(tab => { 
  init(tab)
});