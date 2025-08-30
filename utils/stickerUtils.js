const fs = require('fs');
const path = require('path');
const { tmpdir } = require('os');
const Crypto = require('crypto');
const ff = require('fluent-ffmpeg');
const webp = require('node-webpmux');

async function imageToWebp(media) {
  const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
  const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.jpg`);

  fs.writeFileSync(tmpFileIn, media);

  await new Promise((resolve, reject) => {
    ff(tmpFileIn)
      .on('error', reject)
      .on('end', resolve)
      .addOutputOptions([
        '-vcodec', 'libwebp',
        "-vf", "scale='min(512,iw)':'min(512,ih)':force_original_aspect_ratio=decrease,fps=15",
        '-loop', '0',
        '-preset', 'default',
        '-an',
        '-vsync', '0'
      ])
      .toFormat('webp')
      .save(tmpFileOut);
  });

  const buff = fs.readFileSync(tmpFileOut);
  fs.unlinkSync(tmpFileOut);
  fs.unlinkSync(tmpFileIn);
  return buff;
}

/**
 * Adiciona EXIF ao WebP (nome do pack e autor)
 */
async function writeExif(mediaBuffer, metadata) {
  const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
  const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
  fs.writeFileSync(tmpFileIn, mediaBuffer);

  if (metadata.packname || metadata.author) {
    const img = new webp.Image();
    const json = {
      'sticker-pack-id': 'https://github.com/DikaArdnt/Hisoka-Morou',
      'sticker-pack-name': metadata.packname || '',
      'sticker-pack-publisher': metadata.author || '',
      'emojis': metadata.emojis || ['']
    };
    const exifAttr = Buffer.from([
      0x49, 0x49, 0x2A, 0x00,
      0x08, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x41, 0x57,
      0x07, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x16, 0x00,
      0x00, 0x00
    ]);
    const jsonBuff = Buffer.from(JSON.stringify(json), 'utf-8');
    const exif = Buffer.concat([exifAttr, jsonBuff]);
    exif.writeUIntLE(jsonBuff.length, 14, 4);
    await img.load(tmpFileIn);
    fs.unlinkSync(tmpFileIn);
    img.exif = exif;
    await img.save(tmpFileOut);
    return fs.readFileSync(tmpFileOut);
  } else {
    fs.unlinkSync(tmpFileIn);
    return mediaBuffer;
  }
}

module.exports = { imageToWebp, writeExif };