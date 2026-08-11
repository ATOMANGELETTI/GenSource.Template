import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const releaseDir = path.join(root, "release");
const clean = process.argv.includes("--clean");

const TARGETS = [
  {
    triple: "x86_64-pc-windows-msvc",
    archLabel: "x64",
    nsisArch: "x64",
  },
  {
    triple: "i686-pc-windows-msvc",
    archLabel: "x86",
    nsisArch: "x86",
  },
];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: true,
    env: process.env,
    ...options,
  });
  if (result.error) {
    fail(`Failed to run ${command}: ${result.error.message}`);
  }
  if (result.status !== 0) {
    fail(`${command} ${args.join(" ")} exited with code ${result.status ?? 1}`);
  }
}

function runCapture(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    shell: true,
    env: process.env,
  });
  if (result.error) {
    fail(`Failed to run ${command}: ${result.error.message}`);
  }
  if (result.status !== 0) {
    fail(`${command} ${args.join(" ")} exited with code ${result.status ?? 1}`);
  }
  return (result.stdout ?? "").trim();
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function slugifyProductName(name) {
  return name.replace(/\s+/g, "-");
}

function wipeReleaseDir() {
  if (!existsSync(releaseDir)) {
    mkdirSync(releaseDir, { recursive: true });
    return;
  }
  for (const entry of readdirSync(releaseDir)) {
    rmSync(path.join(releaseDir, entry), { recursive: true, force: true });
  }
}

function ensureRustTargets() {
  const installed = runCapture("rustup", ["target", "list", "--installed"])
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const { triple } of TARGETS) {
    if (!installed.includes(triple)) {
      fail(
        `Missing Rust target ${triple}. Install with:\n  rustup target add ${triple}`,
      );
    }
  }
}

function findNsisSetup(nsisDir, nsisArch) {
  if (!existsSync(nsisDir)) {
    fail(`NSIS output directory not found: ${nsisDir}`);
  }
  const matches = readdirSync(nsisDir).filter(
    (name) =>
      name.toLowerCase().endsWith("-setup.exe") &&
      name.toLowerCase().includes(`_${nsisArch}-setup.exe`.toLowerCase()),
  );
  if (matches.length === 0) {
    const all = readdirSync(nsisDir).filter((n) =>
      n.toLowerCase().endsWith("-setup.exe"),
    );
    if (all.length === 1) {
      return path.join(nsisDir, all[0]);
    }
    fail(
      `Could not find NSIS setup for arch ${nsisArch} in ${nsisDir}. Found: ${
        all.join(", ") || "(none)"
      }`,
    );
  }
  return path.join(nsisDir, matches[0]);
}

function copyDirContents(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const from = path.join(src, entry);
    const to = path.join(dest, entry);
    const st = statSync(from);
    if (st.isDirectory()) {
      copyDirContents(from, to);
    } else {
      cpSync(from, to);
    }
  }
}

function buildPortableZip({
  triple,
  archLabel,
  version,
  productSlug,
  binaryName,
}) {
  const releaseOut = path.join(root, "src-tauri", "target", triple, "release");
  const exeName = `${binaryName}.exe`;
  const exePath = path.join(releaseOut, exeName);
  if (!existsSync(exePath)) {
    fail(`Built binary not found: ${exePath}`);
  }

  const stagingRoot = path.join(releaseDir, `.portable-staging-${archLabel}`);
  const stagingApp = path.join(
    stagingRoot,
    `${productSlug}-${version}-${archLabel}`,
  );
  rmSync(stagingRoot, { recursive: true, force: true });
  mkdirSync(stagingApp, { recursive: true });

  cpSync(exePath, path.join(stagingApp, exeName));

  const otherSrc = path.join(root, "other");
  if (existsSync(otherSrc)) {
    copyDirContents(otherSrc, path.join(stagingApp, "other"));
  }

  const zipName = `${productSlug}-${version}-${archLabel}-portable.zip`;
  const zipPath = path.join(releaseDir, zipName);
  if (existsSync(zipPath)) {
    rmSync(zipPath, { force: true });
  }

  // Compress-Archive paths: compress the app folder so unzip yields one directory.
  run("powershell.exe", [
    "-NoProfile",
    "-Command",
    `Compress-Archive -Path '${stagingApp.replace(/'/g, "''")}' -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force`,
  ]);

  rmSync(stagingRoot, { recursive: true, force: true });
  console.log(`Wrote ${zipPath}`);
}

function main() {
  if (process.platform !== "win32") {
    fail("npm run package is Windows-only.");
  }

  const pkg = readJson(path.join(root, "package.json"));
  const tauriConf = readJson(path.join(root, "src-tauri", "tauri.conf.json"));
  const version = tauriConf.version ?? pkg.version ?? "0.0.0";
  const productName = tauriConf.productName ?? "GenSource Template";
  const productSlug = slugifyProductName(productName);
  const binaryName = "gensource-template";

  mkdirSync(releaseDir, { recursive: true });
  if (clean) {
    console.log("Cleaning release/ …");
    wipeReleaseDir();
  }

  ensureRustTargets();

  for (const target of TARGETS) {
    console.log(`\nBuilding ${target.triple} …`);
    run("tauri", ["build", "--target", target.triple]);

    const nsisDir = path.join(
      root,
      "src-tauri",
      "target",
      target.triple,
      "release",
      "bundle",
      "nsis",
    );
    const setupSrc = findNsisSetup(nsisDir, target.nsisArch);
    const setupDest = path.join(
      releaseDir,
      `${productSlug}-${version}-${target.archLabel}-setup.exe`,
    );
    cpSync(setupSrc, setupDest);
    console.log(`Copied ${setupDest}`);

    buildPortableZip({
      triple: target.triple,
      archLabel: target.archLabel,
      version,
      productSlug,
      binaryName,
    });
  }

  console.log("\nPackaging complete. Artifacts in release/");
}

main();
