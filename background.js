chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "hasHistory") {
        const period = new Date().getTime() - 10 * 60 * 1000;
        chrome.history.search({ text: sender.origin, startTime: 0, endTime: period, maxResults: 1 }).then((results) => {
            sendResponse(results.length === 0);
        });
    }
    return true;
});
