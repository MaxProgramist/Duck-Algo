let pageListPath = "pages.json";
const CURRENT_PAGE = window.location.pathname.split("/").pop();

if (CURRENT_PAGE === "index.html" || CURRENT_PAGE === "")
    pageListPath = "pages/pages.json";

InitBtwPageNavigationButtons(pageListPath);
document.addEventListener("DOMContentLoaded", InitPageControl);


function InitPageControl() {
    InitScrollButton();
    InitContentTable();
}

function InitScrollButton() {
    const SCROLL_BUTTON = document.getElementById("backToTop");
    
    if (SCROLL_BUTTON == null) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300)
            SCROLL_BUTTON.classList.add("is-visible");
        else
            SCROLL_BUTTON.classList.remove("is-visible");
    });

    SCROLL_BUTTON.addEventListener("click", () => { window.scrollTo({top: 0, behavior: "smooth"}); });
}

function InitContentTable() {
    const CONTENT_TABLE = document.getElementById("tableOfContents");
    const MAIN_CONTENT = document.getElementById("mainContent");
    
    if (CONTENT_TABLE == null || MAIN_CONTENT == null) return;

    const CONTENT_DIV = MAIN_CONTENT.children;

    let lastObject_LI = null;
    for (const CURRENT_CHILD of CONTENT_DIV) {
        const CHILD_ID = CURRENT_CHILD.children[0];
        if (CHILD_ID.id == "") continue;

        let newObject_LI = document.createElement("li");
        let newObject_A = document.createElement("a");
        newObject_A.href = `#${CHILD_ID.id}`;
        newObject_A.innerHTML = CHILD_ID.innerHTML;
        newObject_LI.appendChild(newObject_A);

        if (CHILD_ID.tagName == "h3") {
            if (lastObject_LI == null) {
                lastObject_LI = document.createElement("ul");
                CONTENT_TABLE.appendChild(lastObject_LI);
            }

            lastObject_LI.appendChild(newObject_LI);
        } else {
            lastObject_LI = null;
            CONTENT_TABLE.appendChild(newObject_LI);
        }
    }
}

async function InitBtwPageNavigationButtons(path) {
    const CURRENT_PAGE = window.location.pathname.split("/").pop();
    const IS_INDEX_PAGE = CURRENT_PAGE === "index.html";
    const IS_EMPTY_PAGE = CURRENT_PAGE === "";

    if (!IS_INDEX_PAGE && !IS_EMPTY_PAGE)
        path = path.replace(/^.*[\\/]pages[\\/]/, "");

    const JSON_FILE = await fetch(path);
    const DATA = await JSON_FILE.json();
    const NAVIGATION = document.getElementsByTagName('nav')[0];

    for (let currElement of DATA.pages) {
        let newButton = document.createElement('button');
        newButton.textContent = currElement.title; 
        let currentPathToPage = currElement.path;

        if (!IS_INDEX_PAGE && !IS_EMPTY_PAGE)
            currentPathToPage = currentPathToPage.replace(/^pages[\\/]/, "");

        newButton.onclick = () => LoadPage(currentPathToPage);
        newButton.type = "button";

        NAVIGATION.appendChild(newButton);
        NAVIGATION.appendChild(document.createElement('br'));
    }
}

function LoadPage(pagePath) { window.location.href = pagePath; }