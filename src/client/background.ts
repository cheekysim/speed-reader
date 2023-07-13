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
      div.style.height = "max-content";
      div.style.top = "50%";
      div.style.left = "50%";
      div.style.transform = "translate(-50%, -50%)";
      div.style.backgroundColor = "hsl(0, 0%, 10%)";
      div.style.zIndex = "99999";
      div.style.borderRadius = "10px";
      div.style.padding = "0 .5rem .5rem .5rem";

      // Create the header
      let header = div.appendChild(document.createElement("div"));
      header.style.display = "flex";
      header.style.justifyContent = "flex-start";
      header.style.width = "100%";
      header.style.gap = "2rem";
      let btnWrapper = header.appendChild(document.createElement("div"));
      btnWrapper.style.display = "flex";
      btnWrapper.style.gap = ".5rem";
      btnWrapper.style.alignItems = "center";
      let dot1 = btnWrapper.appendChild(document.createElement("div"));
      dot1.style.backgroundColor = "red";
      dot1.style.width = ".8rem";
      dot1.style.height = ".8rem";
      dot1.style.borderRadius = "100%";
      dot1.style.cursor = "pointer";
      dot1.style.fontWeight = "bold";
      dot1.style.fontSize = ".7rem";
      dot1.style.textAlign = "center";
      dot1.style.paddingTop = ".8px";
      dot1.style.color = "rgb(56, 56, 56)";
      dot1.setAttribute("role", "button");
      dot1.addEventListener("click", () => div.remove());
      dot1.addEventListener("mouseover", () => dot1.innerText = "X");
      dot1.addEventListener("mouseleave", () => dot1.innerText = null);
      let dot2 = btnWrapper.appendChild(document.createElement("div"));
      dot2.style.backgroundColor = "yellow";
      dot2.style.width = ".8rem";
      dot2.style.height = ".8rem";
      dot2.style.borderRadius = "100%";
      let dot3 = btnWrapper.appendChild(document.createElement("div"));
      dot3.style.backgroundColor = "green";
      dot3.style.width = ".8rem";
      dot3.style.height = ".8rem";
      dot3.style.borderRadius = "100%";
      let h4 = header.appendChild(document.createElement("h4"));
      h4.innerHTML = "Speedreader";
      h4.style.color = "white";

      // Create the image wrapper
      let imgWrapper = div.appendChild(document.createElement("div"));
      imgWrapper.style.width = "100%";
      
      // Format text
      // Remove Newlines
      text = text.replace(/(\r\n|\n|\r)/gm, " ").trim();
      
      // Replace multiple spaces and commas with a single comma
      text = text.replace(/( +)|(,+)/g, ",").trim();
      
      // Create the GIF
      let url = new URL('http://localhost:3002/api/v1/create');
      url.searchParams.set("words", text)
      url.searchParams.set("theme", "transparent")
      url.searchParams.set("font", "medium")
      url.searchParams.set("wpm", "300")
      let xml = new XMLHttpRequest();
      xml.open('GET', url.toString());
      xml.responseType = 'blob';
      xml.timeout = 10000;
      xml.send();
      xml.onreadystatechange = () => {
        if (xml.readyState === 4 && xml.status === 200) {
          let img = imgWrapper.appendChild(document.createElement('img'));
          img.src = URL.createObjectURL(xml.response);
          img.style.width = "100%";
          img.style.height = "100%";
          img.style.objectFit = "contain";
          img.style.borderRadius = ".6rem";
        }
      }
      xml.ontimeout = () => {
        let p = document.createElement("p");
        p.style.color = "white";
        p.style.textAlign = "center";
        p.innerText = "Failed to create GIF";
        div.appendChild(p);
      }

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
