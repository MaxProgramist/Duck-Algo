function LoadPage(pagePath) {
    window.location.href = pagePath;
}

async function MakePageButtons(path) {
    const CURRENT_PAGE = window.location.pathname.split("/").pop();
    if (CURRENT_PAGE !== "index.html" && CURRENT_PAGE !== "")
        path = path.replace(/^.*[\\/]pages[\\/]/, "");
    const JSON_FILE = await fetch(path);
    const DATA = await JSON_FILE.json();
    const NAVIGATION = document.getElementsByTagName('nav')[0];

    for (let currElement of DATA.pages) {
        let newButton = document.createElement('button');
        newButton.textContent = currElement.title; 
        let currentPathToPage = currElement.path;
        if (CURRENT_PAGE !== "index.html" && CURRENT_PAGE !== "")
            currentPathToPage = currentPathToPage.replace(/^pages[\\/]/, "");
        newButton.onclick = () => LoadPage(currentPathToPage);
        newButton.type = "button";

        NAVIGATION.appendChild(newButton);
        NAVIGATION.appendChild(document.createElement('br'));
    }
}

let currentPath = "pages.json";
const CURRENT_PAGE = window.location.pathname.split("/").pop();

if (CURRENT_PAGE === "index.html" || CURRENT_PAGE === "")
    currentPath = "pages/pages.json";

MakePageButtons(currentPath);