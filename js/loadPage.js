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


function InitScrollToTop() {
    const SCROLL_BUTTON = document.getElementById("backToTop");
  
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            SCROLL_BUTTON.classList.add("is-visible");
        } else {
            SCROLL_BUTTON.classList.remove("is-visible");
        }
    });
  
    SCROLL_BUTTON.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}
  
document.addEventListener("DOMContentLoaded", InitScrollToTop);