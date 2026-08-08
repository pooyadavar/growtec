const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");

const SAVE_DIR = path.join(os.homedir(), "Desktop", "برنامه ابیاری");
const PORT = 3001;

const sanitizeFileName = (name) =>
  String(name)
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 120) || "irrigation_program";

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== "POST" || req.url !== "/save-irrigation-program") {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const payload = JSON.parse(body || "{}");
      const programName = payload.programName;
      const data = payload.data;

      if (!programName || !String(programName).trim()) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "program name required" }));
        return;
      }

      const fileName = `${sanitizeFileName(programName)}.json`;
      fs.mkdirSync(SAVE_DIR, { recursive: true });
      const filePath = path.join(SAVE_DIR, fileName);

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, fileName, filePath }));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Irrigation program save server: http://localhost:${PORT}`);
});
