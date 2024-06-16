 var maxRetries = 50;
    var chatRetry = 0;
    function inlineChat() {
        // Find the chat-widget element
        chatRetry++;
        if (chatRetry > maxRetries) {
            return;
        }
        var chatWidget = document.querySelector('chat-widget');

        if (!chatWidget) {
            console.log('chatWidget not found');
            return;
        }

        // Access the shadow root
        var shadowRoot = chatWidget.shadowRoot;
        
        // Check if the shadow root is available
        if (shadowRoot && shadowRoot.querySelector('button.lc_text-widget--btn')) {
            // Shadow root is available, proceed with clicking the button and appending the style element
            shadowRoot.querySelector('button.lc_text-widget--btn').click();
            window.setTimeout(function() {
                chatWidget.classList.add('showChat');
                adjustChatWidgetHeight();
            }, 75);
            appendStyleElement(shadowRoot);
        } else {
            // Shadow root is not available, retry after a short delay
            setTimeout(() => {
                inlineChat();
            }, 100);
        }
    }
    function adjustChatWidgetHeight() {
        var chatWidget = document.querySelector('chat-widget');
        if (!chatWidget) {
            console.log('chatWidget not found');
            return;
        }

        var widgetBox = chatWidget.shadowRoot.querySelector('.lc_text-widget--box');
        if (!widgetBox) {
            console.log('widgetBox not found');
            return;
        }

        var widgetRect = chatWidget.getBoundingClientRect();
        var viewportHeight = window.innerHeight;
        var availableSpace = viewportHeight - widgetRect.top - 20; // Account for 20px margin at the bottom

        console.log('Widget position from top:', widgetRect.top);
        console.log('Viewport height:', viewportHeight);
        console.log('Available space:', availableSpace);

        if (widgetRect.top > viewportHeight || widgetRect.bottom < 0) {
            // Widget is out of the viewport
            console.log('Widget is out of the viewport');
            widgetBox.style.height = ''; // Use default height
        } else if (availableSpace >= 500) {
            // Sufficient space
            console.log('Sufficient space available');
            widgetBox.style.height = Math.min(availableSpace, 800) + 'px';
        } else {
            // Not enough space but within viewport
            console.log('Not enough space, using default height');
            widgetBox.style.height = '500px'; // Default height
        }
    }

    function appendStyleElement(shadowRoot) {
        // Style tag ID
        var styleId = 'imported-inline-ghl-styles';

        // Remove existing <style> tag with the given ID if it exists
        var existingStyleElement = shadowRoot.querySelector('#' + styleId);
        if (existingStyleElement) {
            shadowRoot.removeChild(existingStyleElement);
        }

        // Create a new <style> element with the CSS content
        var newStyleElement = document.createElement('style');
        newStyleElement.id = styleId;
        newStyleElement.textContent = `
            .lc_text-widget_heading--root {
                display:none;
            }
            .lc_text-widget {
                position: relative !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100%; /* or any specific width you need */
                padding-bottom: 0 !important;
                z-index: auto !important;
            }
            .lc_text-widget--btn {
                position: relative !important;
                right: 0 !important;
                bottom: 0 !important;
                z-index: auto !important;
            }
            .lc_text-widget--inline {
                position: relative !important;
                width: 100%; /* or any specific width you need */
                right: 0 !important;
                bottom: 0 !important;
                z-index: auto !important;
            }
            .chat-pane {
                width: 100% !important;
                flex: 1 1 100% !important;
            }
            .lc_text-widget--box {
                max-width: 100% !important;
            }
            .lc_text-widget--btn {
                display: none !important;
            }
        `;

        // Append the <style> element to the shadow root
        shadowRoot.appendChild(newStyleElement);

        // Check for script#inlinechat element
        var inlineChatScript = document.querySelector('script#inlinechat');
        if (inlineChatScript) {
            // Check for hide_header attribute
            var hideHeader = inlineChatScript.getAttribute('hide-header');
            if (hideHeader === 'true') {
                // Create a new <style> element
                var styleElement = document.createElement('style');
                styleElement.textContent = '.lc_text-widget_heading--root { display: none !important; }';
                
                // Append the <style> element to the shadow root
                shadowRoot.appendChild(styleElement);
            }
        }
    }

    // if (!document.querySelector('#__nuxt'))
    //     {
            wait('chat-widget', 'body').then(inlineChat);
        // }
    // else {
    //     document.addEventListener('hydrationDone', (event) => {
    //        window.setTimeout(inlineChat, 1);
    //     });
    // }

    /* Start Global Functions */
    function wait(selector, parent = "body") {
        return new Promise((resolve) => {
            var parentObserved = document.querySelector(parent)
                ? document.querySelector(parent)
                : document.querySelector("body");
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(parentObserved, {
                childList: true,
                subtree: true,
                attribute: false
            });
        });
    }

    function hideChat() {
        var style = document.createElement('style');
        style.textContent = `
            chat-widget {
                display: none !important;
            }
            chat-widget.showChat {
                display: block !important;
            }
        `;
        document.head.appendChild(style);
    }
    hideChat();
