import https from "node:https";
import http from "node:http";

/**
 * Keeps the server awake by pinging itself periodically.
 * Useful for free tiers like Render or Glitch.
 */
export const startKeepAlive = (url: string | undefined) => {
    if (!url) {
        console.warn("[Keep-Alive] No APP_URL provided. Keep-alive disabled.");
        return;
    }

    // Determine which module to use based on the protocol
    const client = url.startsWith("https") ? https : http;
    const interval = 14 * 60 * 1000; // 14 minutes (Render spins down after 15)

    console.log(`[Keep-Alive] Monitoring ${url} every 14 minutes.`);

    setInterval(() => {
        console.log(`[Keep-Alive] Pinging ${url}...`);
        client.get(url, (res) => {
            console.log(`[Keep-Alive] Response received: ${res.statusCode}`);
        }).on("error", (err) => {
            console.error(`[Keep-Alive] Error: ${err.message}`);
        });
    }, interval);
};
