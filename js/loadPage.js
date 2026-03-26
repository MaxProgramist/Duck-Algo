let currentPath = "pages.json";
const CURRENT_PAGE = window.location.pathname.split("/").pop();

if (CURRENT_PAGE === "index.html" || CURRENT_PAGE === "")
    currentPath = "pages/pages.json";

MakePageButtons(currentPath);
document.addEventListener("DOMContentLoaded", InitPageControl);


function InitPageControl() {
    InitScrollButton();
    InitContentTable();
}

function InitScrollButton() {
    const SCROLL_BUTTON = document.getElementById("backToTop");
    
    if (SCROLL_BUTTON == null) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            SCROLL_BUTTON.classList.add("is-visible");
        } else {
            SCROLL_BUTTON.classList.remove("is-visible");
        }
    });

    SCROLL_BUTTON.addEventListener("click", () => { window.scrollTo({top: 0, behavior: "smooth"}); });
}

function InitContentTable() {
    const CONTENT_TABLE = document.getElementById("tableOfContents");
    const MAIN_CONTENT = document.getElementById("mainContent");
    
    if (CONTENT_TABLE == null || MAIN_CONTENT == null) return;

    const CONTENT_DIV = MAIN_CONTENT.children;

    let lastNewList = null;
    for (const CHILD of CONTENT_DIV) {
        const CURRENT_ELEMENT = CHILD.children[0];
        if (CURRENT_ELEMENT.id == "") continue;

        let newLIObject = document.createElement("li");
        let newAObject = document.createElement("a");
        newAObject.href = `#${CURRENT_ELEMENT.id}`;
        newAObject.innerHTML = CURRENT_ELEMENT.innerHTML;
        newLIObject.appendChild(newAObject);

        if (CURRENT_ELEMENT.tagName == "H3") {
            if (lastNewList == null) {
                lastNewList = document.createElement("ul");
                CONTENT_TABLE.appendChild(lastNewList);
            }

            lastNewList.appendChild(newLIObject);
        } else {
            lastNewList = null;
            CONTENT_TABLE.appendChild(newLIObject);
        }
    }
}

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