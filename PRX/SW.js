// proxy/sw.js

"use strict";

/*
 * SGS Proxy Service Worker
 *
 * This file is intentionally kept small.
 * Scramjet's controller/transport will be connected here.
 */

self.addEventListener("install", event => {
    console.log("[SGS Proxy] Installing");

    self.skipWaiting();
});

self.addEventListener("activate", event => {
    console.log("[SGS Proxy] Activating");

    event.waitUntil(
        self.clients.claim()
    );
});

self.addEventListener("fetch", event => {

    /*
     * For now, let normal requests pass through.
     *
     * The Scramjet routing layer will be inserted here
     * once the required Scramjet runtime files are in SGS.
     */

    event.respondWith(
        fetch(event.request)
    );
});
