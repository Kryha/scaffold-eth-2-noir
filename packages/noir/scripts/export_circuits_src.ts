import { readFileSync, writeFileSync } from "fs";
import { readdir } from "fs/promises";
import path from "path";

const TARGET_FILE = "../nextjs/generated/circuits.json";
const CIRCUITS_FOLDER_PATH = "./circuits";

function getData(project: string) {
  const path = `${CIRCUITS_FOLDER_PATH}/${project}/target/${project}.json`;
  try {
    console.log("🤓 trying to read:", path);
    const code = JSON.parse(readFileSync(path, "utf8") as string);
    return code;
  } catch (err: any) {
    console.error(`❌ error when reading file (${path}) with error: ${err.stack}\n`);
  }
}

async function exportAsJson() {
  const data: any = {};
  const circuits = await readdir(CIRCUITS_FOLDER_PATH);
  for (const name of circuits) {
    data[name] = getData(name);
  }
  writeFileSync(path.resolve(TARGET_FILE), JSON.stringify(data, null, 2));
}

exportAsJson();
