import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const INPUT_DIR = path.resolve("image-src");
const OUTPUT_DIR = path.resolve("image");

const WIDTH = 1200;
const JPG_QUALITY = 80;
const WEBP_QUALITY = 80;
const AVIF_QUALITY = 45;

async function ensureDirs() {
  await fs.mkdir(INPUT_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
}

function isImageFile(file) {
  return /\.(jpe?g|png)$/i.test(file);
}

async function processOne(file) {
  const inputPath = path.join(INPUT_DIR, file);
  const base = path.parse(file).name;

  const outJpg = path.join(OUTPUT_DIR, `${base}.jpg`);
  const outWebp = path.join(OUTPUT_DIR, `${base}.webp`);
  const outAvif = path.join(OUTPUT_DIR, `${base}.avif`);

  const img = sharp(inputPath).rotate();
  const resized = img.resize({ width: WIDTH, withoutEnlargement: true });

  await resized.clone().jpeg({ quality: JPG_QUALITY, mozjpeg: true }).toFile(outJpg);
  await resized.clone().webp({ quality: WEBP_QUALITY }).toFile(outWebp);
  await resized.clone().avif({ quality: AVIF_QUALITY }).toFile(outAvif);

  console.log(`✔ ${file} -> ${base}.{jpg,webp,avif}`);
}

async function main() {
  await ensureDirs();

  const files = await fs.readdir(INPUT_DIR);
  const images = files.filter(isImageFile);

  if (!images.length) {
    console.log("No images found in image-src. Add .jpg/.jpeg/.png files and run again.");
    return;
  }

  await Promise.all(images.map(processOne));
  console.log("✅ Image optimization complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
