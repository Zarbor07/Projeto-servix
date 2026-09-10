const http = require("http");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const publicRoot = path.resolve(__dirname, "..");
const mimeTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp"
};

const server = http.createServer((request, response) => {
    if (request.url === "/env-config.js") {
        const config = {
            SUPABASE_URL: process.env.SUPABASE_URL,
            SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
        };

        response.writeHead(200, {
            "Content-Type": "application/javascript; charset=utf-8",
            "Cache-Control": "no-store"
        });
        response.end(`window.__SERVIX_ENV__ = ${JSON.stringify(config)};`);
        return;
    }

    const requestedPath = decodeURIComponent(request.url.split("?")[0]);
    const relativePath = requestedPath === "/" ? "index.html" : requestedPath.slice(1);
    const filePath = path.resolve(publicRoot, relativePath);

    if (!filePath.startsWith(publicRoot) || !fs.existsSync(filePath)) {
        response.writeHead(404);
        response.end("Not found");
        return;
    }

    response.writeHead(200, {
        "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream"
    });
    fs.createReadStream(filePath).pipe(response);
});

const port = Number(process.env.PORT) || 3000;
server.listen(port, () => {
    console.log(`Servix disponível em http://localhost:${port}`);
});