declare const _default: "(() => {\n    \"use strict\";\n    if (!window.ReactNativeWebView) {\n        return;\n    }\n    const WebLNPromiseCallback = {};\n    const timeout = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));\n    let requestId = 0;\n    let weblnEnabled = false;\n    window.webln = {\n        enable: async () => {\n            if (document.domain !== \"tippin.me\") {\n                weblnEnabled = true;\n            }\n            return;\n        },\n        getInfo: async () => {\n            return await postMessage({\n                type: \"getInfo\",\n                data: null,\n            });\n        },\n        makeInvoice: async (args) => {\n            const result = await postMessage({\n                type: \"makeInvoice\",\n                data: args,\n            });\n            checkedInvoices.push((\"lightning:\" + result.paymentRequest).toUpperCase());\n            return result;\n        },\n        sendPayment: async (paymentRequest) => {\n            return await postMessage({\n                type: \"sendPayment\",\n                data: paymentRequest,\n            });\n        },\n        signMessage: async () => {\n            return {\n                message: \"\",\n                signature: \"\",\n            };\n        },\n        verifyMessage: async () => {\n            return;\n        },\n    };\n    const postMessage = async (message, waitForCallback = true) => {\n        const currentId = requestId++;\n        window.ReactNativeWebView.postMessage(JSON.stringify({\n            ...message,\n            id: currentId,\n        }));\n        if (!waitForCallback) {\n            return;\n        }\n        while (!WebLNPromiseCallback[currentId]) {\n            await timeout(1000);\n        }\n        if (WebLNPromiseCallback[currentId] instanceof Error) {\n            throw WebLNPromiseCallback[currentId];\n        }\n        return WebLNPromiseCallback[currentId];\n    };\n    document.addEventListener(\"webln\", (event) => {\n        WebLNPromiseCallback[event.detail.id] = event.detail.data;\n    });\n    const checkedInvoices = [];\n    if (window.reactNativeWebLNCheckTags) {\n        const checkATags = async () => {\n            const aTags = document.querySelectorAll(\"a\");\n            for (const aTag of aTags) {\n                if (aTag.href &&\n                    aTag.href.toUpperCase().startsWith(\"LIGHTNING:\") &&\n                    aTag.href.length > \"LIGHTNING:\".length) {\n                    const invoice = aTag.href.toUpperCase().replace(\"LIGHTNING:\", \"\");\n                    if (checkedInvoices.includes(invoice)) {\n                        return;\n                    }\n                    if (weblnEnabled && invoice.startsWith(\"LNBC\")) {\n                        return;\n                    }\n                    debug(\"Found: \" + aTag.href);\n                    checkedInvoices.push(invoice);\n                    await postMessage({\n                        type: \"nonwebln_foundInvoice\",\n                        data: invoice\n                    }, false);\n                    break;\n                }\n            }\n        };\n        setInterval(() => {\n            checkATags();\n        }, 850);\n    }\n    const debug = async (message) => {\n        if (window.reactNativeWebLNDebug) {\n            await postMessage({\n                type: \"debug\",\n                data: message,\n            }, false);\n        }\n    };\n})();";
export default _default;
