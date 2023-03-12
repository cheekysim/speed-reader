function speedread(text: string, tabId: number) {
  // @ts-ignore - chrome is not defined in the types
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    args: [text],
    function: (text: string) => {
      let body = document.body;
      // Create the main container
      let div = document.createElement("div");
      div.setAttribute("id", "sr-main");
      div.style.position = "fixed";
      div.style.display = "grid";
      div.style.placeItems = "center";
      div.style.width = "50vw";
      div.style.height = "50vh";
      div.style.top = "50%";
      div.style.left = "50%";
      div.style.transform = "translate(-50%, -50%)";
      div.style.backgroundColor = "hsl(0, 0%, 10%)";
      div.style.zIndex = "99999";
      div.style.borderRadius = "10px";
      
      // Format text
      // Remove Newlines
      text = text.replace(/(\r\n|\n|\r)/gm, " ").trim();
      console.log(text);
      // Replace multiple spaces and commas with a single comma
      text = text.replace(/( +)|(,+)/g, ",").trim();
      console.log(text);
      // Create the gif
      let url = new URL('http://localhost:3002/api/v1/create');
      url.searchParams.set('words', text)
      url.searchParams.set('theme', 'dark')
      url.searchParams.set('font', 'medium')
      url.searchParams.set('wpm', '300')
      let xml = new XMLHttpRequest();
      xml.open('GET', url.toString());
      xml.responseType = 'blob';
      xml.timeout = 10000;
      xml.send();
      xml.onreadystatechange = () => {
        if (xml.readyState === 4) {
          if (xml.status === 200) {
            let img = document.createElement('img');
            img.src = URL.createObjectURL(xml.response);
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            div.appendChild(img);
          }
        }
      }
      xml.ontimeout = () => {
        let p = document.createElement('p');
        p.style.color = 'white';
        p.style.textAlign = 'center';
        p.innerText = 'Failed to create GIF';
        div.appendChild(p);
      }
      // Create close button
      let close = document.createElement("button");
      close.innerText = "X";
      close.style.position = "absolute";
      close.style.top = "0";
      close.style.right = "0";
      close.style.padding = "10px";
      close.style.backgroundColor = "hsl(0, 0%, 10%)";
      close.style.border = "none";
      close.style.color = "white";
      close.style.fontWeight = "bold";
      close.style.borderRadius = "0 0 0 10px";
      close.onclick = () => {
        div.remove();
      };
      div.appendChild(close);
      // Append to body
      body.appendChild(div);
    },
  });
}

// @ts-ignore - chrome is not defined in the types
chrome.contextMenus.create({
  id: "speedread",
  title: "Speedread",
  contexts: ["selection"],
});

// @ts-ignore - chrome is not defined in the types
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId == "speedread") {
    // @ts-ignore - chrome is not defined in the types
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
      speedread(info.selectionText, tabs[0].id);
    });
  }
});
