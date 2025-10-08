// bump-version.js
import fs from "fs";

const envPath = "./.env";
const envFile = fs.readFileSync(envPath, "utf-8");

// Permite espacios alrededor del signo igual
const versionLine = envFile.split("\n").find((line) =>
  line.trim().startsWith("VITE_VERSION")
);

if (!versionLine) {
  console.error("❌ No se encontró VITE_VERSION en .env");
  process.exit(1);
}

const [key, rawValue] = versionLine.split("=");
if (!rawValue) {
  console.error("❌ La línea VITE_VERSION no tiene un valor válido");
  process.exit(1);
}

const versionValue = rawValue.trim();
const [version, stage] = versionValue.split(" ");
const [major, minor, patch, build] = version.replace("v", "").split(".").map(Number);

// Incrementa el build
const newBuild = (build || 0) + 1;
const newVersion = `v${major}.${minor}.${patch}.${newBuild} ${stage || ""}`.trim();

// Reemplaza la línea vieja por la nueva (acepta espacios)
const newEnv = envFile.replace(
  versionLine,
  `VITE_VERSION=${newVersion}`
);

fs.writeFileSync(envPath, newEnv);
console.log(`✅ Versión actualizada a ${newVersion}`);
