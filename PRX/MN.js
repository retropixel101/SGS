"use strict";

/*
 * SGS Proxy Main
 *
 * This file will initialize the official
 * Scramjet controller and transport once
 * the corresponding official build artifacts
 * are added to PRX.
 */

(() => {

    if (!window.SGS_PROXY) {
        throw new Error(
            "SGS Proxy Loader has not been initialized."
        );
    }

    const config =
        window.SGS_PROXY.config;

    console.log(
        "[SGS Proxy] Main loaded."
    );

    /*
     * The official Scramjet controller and
     * transport will be initialized here.
     *
     * We are intentionally leaving this section
     * empty until we have the matching official
     * Scramjet build.
     */

    window.SGS_PROXY.start = function () {

        console.warn(
            "[SGS Proxy] Scramjet runtime has not been installed yet."
        );

    };

})();
