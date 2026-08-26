// =========================================================
// SGS - Clean Scramjet Main
// =========================================================

(() => {
    "use strict";

    let controller = null;

    function getConfig() {
        if (!window.SGS_PROXY_CONFIG) {
            throw new Error(
                "SGS Proxy: loader.js has not been initialized."
            );
        }

        return window.SGS_PROXY_CONFIG;
    }


    async function waitForServiceWorker() {

        if (!("serviceWorker" in navigator)) {
            throw new Error(
                "SGS Proxy: Service Workers are unavailable."
            );
        }

        if (navigator.serviceWorker.controller) {
            return navigator.serviceWorker.controller;
        }

        await navigator.serviceWorker.ready;

        if (navigator.serviceWorker.controller) {
            return navigator.serviceWorker.controller;
        }

        return new Promise((resolve, reject) => {

            const timeout = setTimeout(() => {
                reject(
                    new Error(
                        "SGS Proxy: Service Worker did not take control."
                    )
                );
            }, 10000);

            const handler = () => {
                clearTimeout(timeout);

                navigator.serviceWorker.removeEventListener(
                    "controllerchange",
                    handler
                );

                if (navigator.serviceWorker.controller) {
                    resolve(
                        navigator.serviceWorker.controller
                    );
                } else {
                    reject(
                        new Error(
                            "SGS Proxy: Service Worker controller unavailable."
                        )
                    );
                }
            };

            navigator.serviceWorker.addEventListener(
                "controllerchange",
                handler,
                { once: true }
            );
        });
    }


    async function createTransport(config) {

        /*
         * The actual transport library is supplied by the
         * official Scramjet ecosystem.
         *
         * This file intentionally does not implement the
         * transport itself.
         */

        if (!window.SGSProxyTransport) {
            throw new Error(
                "SGS Proxy: transport client has not been loaded."
            );
        }

        return new window.SGSProxyTransport({
            wisp: config.wisp
        });
    }


    async function initialize() {

        const config = getConfig();

        console.log(
            "[SGS Proxy] Waiting for service worker..."
        );

        const serviceWorker =
            await waitForServiceWorker();

        console.log(
            "[SGS Proxy] Service worker ready."
        );


        const transport =
            await createTransport(config);


        /*
         * Controller is provided by the official
         * @mercuryworkshop/scramjet-controller package.
         *
         * When we build the SGS bundle, this will be
         * exposed to this page.
         */

        if (!window.ScramjetController) {
            throw new Error(
                "SGS Proxy: Scramjet controller is not loaded."
            );
        }


        controller =
            new window.ScramjetController.Controller({

                serviceworker: serviceWorker,

                transport: transport,

                scramjetConfig: {

                    flags: {
                        allowFailedIntercepts: true
                    },

                    maskedfiles: [
                        "inject.js",
                        "scramjet.wasm.js"
                    ]
                }
            });


        await controller.wait();


        window.SGSProxyController = controller;


        console.log(
            "[SGS Proxy] Controller initialized."
        );


        window.dispatchEvent(
            new CustomEvent(
                "sgs-proxy-initialized",
                {
                    detail: {
                        controller
                    }
                }
            )
        );


        return controller;
    }


    // Start once loader.js has registered the SW.
    window.addEventListener(
        "sgs-proxy-ready",
        () => {

            initialize().catch(error => {

                console.error(
                    "[SGS Proxy] Initialization failed:",
                    error
                );

                window.dispatchEvent(
                    new CustomEvent(
                        "sgs-proxy-error",
                        {
                            detail: error
                        }
                    )
                );
            });

        },
        { once: true }
    );


    // Public API for SGS.
    window.SGSProxy = window.SGSProxy || {};

    window.SGSProxy.initialize =
        initialize;

    window.SGSProxy.getController =
        () => controller;

})();
