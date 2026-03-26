function InitPageSettings() {
    const SetReadyState = () => {
        const PAGE_BODY = document.body;
        if (PAGE_BODY) {
            PAGE_BODY.classList.remove("is-loading");
        }
    };

    if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", SetReadyState);
    } else {
        SetReadyState();
    }
}

InitPageSettings();