const NAV_OBJECT = document.querySelector("nav");
const PAGES_LIST_PATH = '../pages/pagesList.json';

async function LoadPages() {
    let jsonPages = await (await fetch(PAGES_LIST_PATH)).json();
    let pages = jsonPages.pages;

    let thisPageName = GetMeta("description");

    if (thisPageName != '') {
        let navigationButton = document.createElement("button");
        navigationButton.innerText = "Головне меню";
        navigationButton.onclick = () => { window.location.href = '../index.html'; }

        NAV_OBJECT.appendChild(navigationButton);
    }

    for (let page of pages) {
        if (page.name == thisPageName) continue;

        let navigationButton = document.createElement("button");
        navigationButton.innerText = page.text;
        navigationButton.onclick = () => { window.location.href = page.path; }

        NAV_OBJECT.appendChild(navigationButton);
    }
}

function InitContentTable() {
    let contentTable = document.getElementById("contents");

    if (contentTable == undefined) return;

    let headlines = document.querySelectorAll("h1, h2, h3, h4, h5");

    let ulList = [document.createElement("ul")];
    let lastH = ["H1"];

    for (let currHeadline of headlines) {
        let newLi = document.createElement("li");
        let newA = document.createElement("a");


        newA.innerText = currHeadline.innerText;
        newA.href = "#" + currHeadline.id;
        newLi.appendChild(newA);
        if (lastH[lastH.length - 1] < currHeadline.tagName) {
            ulList.push(document.createElement("ul"));

            lastH.push(currHeadline.tagName);
        } else if (lastH[lastH.length - 1] > currHeadline.tagName) {
            while (lastH[lastH.length - 1] != currHeadline.tagName && lastH.length > 1) {
                ulList[ulList.length - 2].appendChild(ulList[ulList.length - 1]);

                ulList.pop();
                lastH.pop();
            }
        }

        ulList[ulList.length - 1].appendChild(newLi);
    }

    while (lastH.length > 1) {
        ulList[ulList.length - 2].appendChild(ulList[ulList.length - 1]);

        ulList.pop();
        lastH.pop();
    }

    contentTable.appendChild(ulList[0]);
}

function GetMeta(metaName) {
    const metas = document.getElementsByTagName('meta');

    for (let i = 0; i < metas.length; i++)
        if (metas[i].getAttribute('name') === metaName)
            return metas[i].getAttribute('content');

    return '';
}

function InitScrollButton() {
    const SCROLL_BUTTON = document.getElementById("backToTop");

    if (SCROLL_BUTTON == null) return;

    window.addEventListener("scroll", () => {
        if (document.documentElement.scrollTop > 300 || document.body.scrollTop > 300)
            SCROLL_BUTTON.classList.add("is-visible");
        else
            SCROLL_BUTTON.classList.remove("is-visible");
    });

    SCROLL_BUTTON.addEventListener("click", () => {
        document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
        document.body.scrollTo({ top: 0, behavior: "smooth" });
    });
}


LoadPages();
InitContentTable();
InitScrollButton();
