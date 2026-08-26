"use strict";

/*
 * SGS Proxy Loader
 *
 * This file contains only SGS bootstrap logic.
 * No external CDN.
 * No redirects.
 * No tracking.
 * No injected advertising.
 */

(() => {
    const CONFIG = {
        base: "/PRX",

        main: "/PRX/MN.js",

        serviceWorker: "/PRX/sw.js"
    };

    window.SGS_PROXY = {
        config: CONFIG,
        ready: false
    };

    function loadMain() {
        const script = document.createElement("script");

        script.src = CONFIG.main;
        script.async = false;

        script.onload = () => {
            window.dispatchEvent(
                new Event("sgs-proxy-loader-ready")
            );
        };

        script.onerror = () => {
            console.error(
                "[SGS Proxy] Failed to load MN.js"
            );
        };

        document.head.appendChild(script);
    }

    if (!("serviceWorker" in navigator)) {
        console.error(
            "[SGS Proxy] This browser does not support Service Workers."
        );

        return;
    }

    navigator.serviceWorker.register(
        CONFIG.serviceWorker,
        {
            scope: "/PRX/"
        }
    )
    .then(registration => {

        console.log(
            "[SGS Proxy] Service Worker registered:",
            registration.scope
        );

        window.SGS_PROXY.registration =
            registration;

        loadMain();
    })
    .catch(error => {

        console.error(
            "[SGS Proxy] Service Worker registration failed:",
            error
        );
    });
})();
