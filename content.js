function hook(node) {
    const inputs = node.querySelectorAll("input[type='password']");
    for (let input of inputs) {
        input.addEventListener("focus", (e) => {
            const rect = e.target.getBoundingClientRect();
            const popup = document.createElement("div");
            popup.style.all = "initial";
            popup.style.position = "absolute";
            popup.style.backgroundColor = "lightyellow";
            popup.style.zIndex = "99999";
            popup.style.left = `${rect.left}px`;
            popup.style.top = `${rect.top + rect.height}px`;
            popup.style.padding = "10px";
            popup.style.borderRadius = "8px";
            popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
            popup.style.display = "grid";
            popup.style.gridTemplateColumns = "auto auto";
            popup.style.gridTemplateRows = "auto auto";

            const icon = document.createElement("div");
            icon.style.all = "initial";
            icon.style.fontSize = "26px";
            icon.style.gridRow = "1/3";
            icon.style.marginRight = "8px";
            icon.appendChild(document.createTextNode("⚠️"));
            popup.appendChild(icon);

            const title = document.createElement("p");
            title.style.all = "initial";
            title.style.fontWeight = "bold";
            title.style.fontSize = "14px";
            title.appendChild(document.createTextNode(browser.i18n.getMessage("title")));
            popup.appendChild(title);

            const message = document.createElement("p");
            message.style.all = "initial";
            message.style.fontSize = "14px";
            for (const text of browser.i18n.getMessage("message", location.origin).split("\n")) {
                message.appendChild(document.createTextNode(text));
                message.appendChild(document.createElement("br"));
            }
            popup.appendChild(message);

            document.body.appendChild(popup);

            e.target.addEventListener("blur", () => {
                popup.remove();
            });
        });
    }
}

function mutate(records, observer) {
    for (const record of records) {
        if (record.type !== "childList") {
            continue;
        }

        for (const node of record.addedNodes) {
            if (node.nodeType !== Node.ELEMENT_NODE) {
                continue;
            }
            hook(node);
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const response = await chrome.runtime.sendMessage({ action: "hasHistory" });
    if (response) {
        const observer = new MutationObserver(mutate);
        observer.observe(document.body, { childList: true, subtree: true });
        hook(document.body);
    }
});
