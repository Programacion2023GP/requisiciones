// bump-version.js
import fs from "fs";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (text) =>
  new Promise((resolve) => {
    rl.question(text, (answer) => {
      resolve(answer.trim());
    });
  });

const askYesNo = async (text) => {
  const response = await ask(text);
  return response.toLowerCase() === "y";
};

const bumpVersion = async () => {
  const envPath = "./.env";
  const versionsPath = "./versions.md";

  if (!fs.existsSync(envPath)) {
    console.error("❌ No se encontró el archivo .env");
    process.exit(1);
  }

  const envFile = fs.readFileSync(envPath, "utf-8");

  const versionLine = envFile
    .split("\n")
    .find((line) => line.trim().startsWith("VITE_VERSION"));

  if (!versionLine) {
    console.error("❌ No se encontró VITE_VERSION en .env");
    process.exit(1);
  }

  const [key, rawValue] = versionLine.split("=");
  const versionValue = rawValue.trim();
  const [version, stage] = versionValue.split(" ");
  let [major, minor, patch, build] = version
    .replace("v", "")
    .split(".")
    .map(Number);

  console.log(`📦 Versión actual: v${major}.${minor}.${patch}.${build} ${stage || ""}\n`);

  const bumpMajor = await askYesNo("¿Incrementar versión MAYOR? (y/n): ");
  if (bumpMajor) {
    major++;
    minor = 0;
    patch = 0;
    build = 0;
  } else {
    const bumpMinor = await askYesNo("¿Incrementar versión MENOR? (y/n): ");
    if (bumpMinor) {
      minor++;
      patch = 0;
      build = 0;
    } else {
      const bumpPatch = await askYesNo("¿Incrementar versión PATCH (cambios menores o estilos)? (y/n): ");
      if (bumpPatch) {
        patch++;
        build = 0;
      }
    }
  }

  // Siempre se incrementa el build
  build++;

  const newVersion = `v${major}.${minor}.${patch}.${build}`;
  const fullVersion = `VITE_VERSION = ${newVersion} ${stage || ""}`.trim();

  // Pregunta por comentario de cambios
  const changelog = await ask(`📝 Describe brevemente el cambio realizado:\n> `);

  // Actualiza .env
  const newEnv = envFile.replace(versionLine, `${key}=${newVersion} ${stage || ""}`);
  fs.writeFileSync(envPath, newEnv);

  // Agrega entrada en versions.md
const versionEntry = `\n#####${fullVersion}\n${changelog.trim()}\n`;
  fs.appendFileSync(versionsPath, versionEntry);

  console.log(`\n✅ Versión actualizada a ${newVersion}`);
  console.log(`🗒️  Cambios registrados en versions.md`);

  rl.close();
};

bumpVersion();
