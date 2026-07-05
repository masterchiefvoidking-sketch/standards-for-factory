import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import AdmZip from "adm-zip";
import type { PackageContents } from "./types.js";
import { OPTIONAL_FILES, REQUIRED_FILES } from "./types.js";

const ALL_FILES = [...REQUIRED_FILES, ...OPTIONAL_FILES];

function readDirPackage(dir: string): PackageContents {
  const files = new Map<string, string>();

  for (const name of ALL_FILES) {
    const filePath = path.join(dir, name);
    if (fs.existsSync(filePath)) {
      files.set(name, filePath);
    }
  }

  return { rootDir: dir, files };
}

function extractZipPackage(zipPath: string): PackageContents {
  const zip = new AdmZip(zipPath);
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "factory-cert-"));
  zip.extractAllTo(tempDir, true);

  const entries = fs.readdirSync(tempDir, { withFileTypes: true });
  const subdirs = entries.filter((e) => e.isDirectory());

  let rootDir = tempDir;
  if (subdirs.length === 1 && entries.length === 1) {
    rootDir = path.join(tempDir, subdirs[0].name);
  }

  const contents = readDirPackage(rootDir);
  contents.cleanup = () => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  };
  return contents;
}

export function loadPackage(inputPath: string): PackageContents {
  const resolved = path.resolve(inputPath);

  if (!fs.existsSync(resolved)) {
    throw new Error(`Package path does not exist: ${resolved}`);
  }

  const stat = fs.statSync(resolved);

  if (stat.isDirectory()) {
    return readDirPackage(resolved);
  }

  if (resolved.endsWith(".zip")) {
    return extractZipPackage(resolved);
  }

  throw new Error(
    `Unsupported package path. Provide a directory or .zip file: ${resolved}`
  );
}

export function readFileText(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}
