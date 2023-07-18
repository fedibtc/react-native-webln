"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onMessageHandler = (webview, requests) => async (event) => {
    if (!webview.current) {
        console.error("react-native-webln: Reference to webview is not properly set.\n" +
            "postMessageHandler needs to have a ref to webview in order to work");
    }
    requests.foundInvoice = requests.foundInvoice || (async () => { });
    const request = JSON.parse(event.nativeEvent.data);
    const id = request.id;
    switch (request.type) {
        case "debug": {
            console.log("Debug", request);
            break;
        }
        case "getInfo": {
            try {
                const response = await requests.getInfo();
                injectResponseToWebView(webview.current, id, JSON.stringify(response));
            }
            catch (e) {
                injectResponseToWebView(webview.current, id, new Error(e.message));
            }
            break;
        }
        case "makeInvoice": {
            try {
                const response = await requests.makeInvoice(request.data);
                injectResponseToWebView(webview.current, id, JSON.stringify(response));
            }
            catch (e) {
                injectResponseToWebView(webview.current, id, new Error(e.message));
            }
            break;
        }
        case "sendPayment": {
            try {
                const response = await requests.sendPayment(request.data);
                injectResponseToWebView(webview.current, id, JSON.stringify(response));
            }
            catch (e) {
                injectResponseToWebView(webview.current, id, new Error(e.message));
            }
            break;
        }
        case "signMessage": {
            try {
                const response = await requests.signMessage(request.data);
                injectResponseToWebView(webview.current, id, JSON.stringify(response));
            }
            catch (e) {
                injectResponseToWebView(webview.current, id, new Error(e.message));
            }
            break;
        }
        case "verifyMessage": {
            try {
                const response = await requests.verifyMessage(request.data.signature, request.data.message);
                injectResponseToWebView(webview.current, id, JSON.stringify(response));
            }
            catch (e) {
                injectResponseToWebView(webview.current, id, new Error(e.message));
            }
            break;
        }
        case "nonwebln_foundInvoice": {
            try {
                await requests.foundInvoice(request.data);
            }
            catch (e) {
                console.log(`nonwebln_foundInvoice failed: ${e.message}`);
            }
        }
    }
};
exports.onMessageHandler = onMessageHandler;
const injectResponseToWebView = (webview, id, inject) => {
    console.log("inject");
    webview.injectJavaScript(`document.dispatchEvent(
      new CustomEvent("webln", {
        detail: {
          id: "${id}",
          data: ${inject instanceof Error ? `new Error("${inject.message}")` : inject}
        }
      })
    );`);
};
//# sourceMappingURL=postMessage-handler.js.map