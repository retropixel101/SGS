// =========================================================
// SGS - Clean Scramjet Loader
// =========================================================

(() => {
    "use strict";

    const SGS_CONFIG = {
        // Where your locally hosted Scramjet files live.
        basePath: "/scramjet",

        // Scramjet service worker.
        serviceWorker: "/scramjet/sw.js",

        // Scramjet controller files.
        controllerApi: "/scramjet/controller/controller.api.js",
        controllerInject: "/scramjet/controller/controller.inject.js",
        controllerSw: "/scramjet/controller/controller.sw.js",

        // Scramjet runtime.
        scramjet: "/scramjet/scramjet.js",
        wasm: "/scramjet/scramjet.wasm",
        utils: "/scramjet/scramjet-utils.js",

        // Transport client.
        transportClient: "/scramjet/clients/libcurl-client.js",

        // Your own transport endpoint.
        wisp: "wss://proxy.YOUR-SGS-DOMAIN.com/wisp/"
    };

    window.SGS_PROXY_CONFIG = SGS_CONFIG;

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");

            script.src = src;
            script.async = false;

            script.onload = resolve;

            script.onerror = () => {
                reject(
                    new Error(`SGS Proxy: failed to load ${src}`)
                );
            };

            document.head.appendChild(script);
        });
    }

    async function registerServiceWorker() {
        if (!("serviceWorker" in navigator)) {
            throw new Error(
                "SGS Proxy: Service Workers are not supported."
            );
        }

        const registration =
            await navigator.serviceWorker.register(
                SGS_CONFIG.serviceWorker,
                {
                    scope: "/"
                }
            );

        await navigator.serviceWorker.ready;

        return registration;
    }

    async function initialize() {
        try {
            console.log("[SGS Proxy] Starting...");

            // Register our own service worker.
            const registration =
                await registerServiceWorker();

            console.log(
                "[SGS Proxy] Service worker registered.",
                registration
            );

            // Notify main.js that the worker is ready.
            window.dispatchEvent(
                new CustomEvent("sgs-proxy-ready", {
                    detail: {
                        config: SGS_CONFIG,
                        registration
                    }
                })
            );

        } catch (error) {

            console.error(
                "[SGS Proxy] Initialization failed:",
                error
            );

            window.dispatchEvent(
                new CustomEvent("sgs-proxy-error", {
                    detail: error
                })
            );
        }
    }

    window.SGSProxy = {
        config: SGS_CONFIG,
        start: initialize
    };

})();
