import { DOMMessage } from "../types/DOMMessages";

const getProductNameListener = (
  message: DOMMessage,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void
) => {
  if (message.type === "GET_PRODUCT_NAME") {
    const title = document.getElementById("productTitle")?.innerText;

    if (title) {
      sendResponse(title);
      return;
    }
  }

  sendResponse(null);
};

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(getProductNameListener);
