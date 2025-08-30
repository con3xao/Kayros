const fs = require("fs");
const path = require("path");
const { tmpdir } = require("os");
const crypto = require("crypto");
const { fileTypeFromBuffer } = require("file-type");
const ffmpeg = require("fluent-ffmpeg");
const webp = require("node-webpmux");

const tmpRename = path.join(tmpdir(), "rename");
if (!fs.existsSync(tmpRename)) fs.mkdirSync(tmpRename, { recursive: true });

function randomName(ext = "webp") {
  return path.join(tmpRename, `${crypto.randomBytes(6).toString("hex")}.${ext}`);
}

async function imageToWebp(mediaBuffer) {
  if (!mediaBuffer || !mediaBuffer.length) throw new Error("Buffer inválido");

  // Detecta tipo real do arquivo
  const type = await fileTypeFromBuffer(mediaBuffer);
  const ext = type ? type.ext : "png";

  if (ext === "webp") return mediaBuffer;

  const tmpIn = randomName(ext);
  const tmpOut = randomName("webp");
  fs.writeFileSync(tmpIn, mediaBuffer);

  try {
    await new Promise((resolve, reject) => {
      ffmpeg(tmpIn)
        .on("error", reject)
        .on("stderr", console.log) // logs para debug
        .on("end", resolve)
        .addOutputOptions([
          "-vcodec", "libwebp",
          "-vf", "scale='min(512,iw)':'min(512,ih)':force_original_aspect_ratio=decrease,fps=15",
          "-loop", "0",
          "-preset", "default",
          "-an",
          "-vsync", "0"
        ])
        .toFormat("webp")
        .save(tmpOut);
    });

    const buffer = fs.readFileSync(tmpOut);
    return buffer;

  } finally {
    fs.existsSync(tmpIn) && fs.unlinkSync(tmpIn);
    fs.existsSync(tmpOut) && fs.unlinkSync(tmpOut);
  }
}

async function writeExif(buffer, metadata) {
  if (!buffer || !buffer.length) throw new Error("Buffer inválido");

  const tmpIn = randomName("webp");
  const tmpOut = randomName("webp");
  fs.writeFileSync(tmpIn, buffer);

  if (!metadata.packname && !metadata.author) return buffer;

  try {
    const img = new webp.Image();
    await img.load(tmpIn);

    const json = {
      "sticker-pack-id": "https://github.com/DikaArdnt/Hisoka-Morou",
      "sticker-pack-name": metadata.packname || "",
      "sticker-pack-publisher": metadata.author || "",
      "emojis": metadata.emojis || [""]
    };

    const exifAttr = Buffer.from([
      0x49,0x49,0x2A,0x00,
      0x08,0x00,0x00,0x00,
      0x01,0x00,0x41,0x57,
      0x07,0x00,0x00,0x00,
      0x00,0x00,0x16,0x00,
      0x00,0x00
    ]);

    const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
    const exif = Buffer.concat([exifAttr, jsonBuff]);
    exif.writeUIntLE(jsonBuff.length, 14, 4);

    img.exif = exif;
    await img.save(tmpOut);

    return fs.readFileSync(tmpOut);

  } finally {
    fs.existsSync(tmpIn) && fs.unlinkSync(tmpIn);
    fs.existsSync(tmpOut) && fs.unlinkSync(tmpOut);
  }
}

module.exports = { imageToWebp, writeExif };