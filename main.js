chrome.tabs.onUpdated.addListener(function(){
    function updatePage(tabId, changeInfo, tab) {

        let identifyPage  = function () {
            if (window.location.host === "www.youtube.com") {
                checkIsAds() ? observeDOMTreeYT() : null;
            } else if (window.location.host === "poczta.interia.pl") {
                window.location.hash.includes('#/folder/1/') ? moveInteriaMessage() : null;
            }
        };

        let moveInteriaMessage = function () {
            let getAllMessage = document.querySelectorAll(".msglist-item"),
                moveButtons = document.querySelector(".form-container--with-overflow ul").childNodes;

            for (let message of getAllMessage) {
                if (message.childNodes[1].textContent.includes("dostarczone przez Interię") || message.outerText.includes("Interi")) {
                    message.childNodes[0].childNodes[1].click();
                }
            }

            for (let buttonAds of moveButtons) {
                if (buttonAds.childNodes[0] && buttonAds.childNodes[0].innerText === "Reklamy") {
                    buttonAds.childNodes[0].click();
                }
            }
        };

        let checkIsAds = function ()  {
            let ads = document.querySelector(".ad-showing");

            if (ads !== null) {
                return true;
            }
            return false;
        };

        let observeDOMTreeYT = function () {
            let targetNode = document.querySelector('.html5-video-player');
            const config = { attributes: true, childList: true, subtree: true };

            let callback = function(mutationsList) {
                if (checkIsAds()) {
                    clickSkipButtonWhileExist(observer);
                }
            };

            let observer = new MutationObserver(callback);

            observer.observe(targetNode, config);
         };

        let clickSkipButtonWhileExist = function (observer) {
            let getButtonSkip = document.querySelector(".videoAdUiSkipButton ");
            if (getButtonSkip !== null ) { // zmienic ten warunek bo button pojawia sie zawsze, ale mozlwosc klikniecia jest wtedy gdy znika mozesz pominac reklame
                getButtonSkip.click();
                if (!checkIsAds()) {
                    observer.disconnect();
                }
            }
        };
        identifyPage();

        return document.body;
    }

    // chrome.tabs.executeScript({
    //     code: '(' + updatePage + ')();'
    // }, (results) => {
    // });
});