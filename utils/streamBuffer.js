const { Buffer } = require("buffer");

async function toBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

module.exports = { toBuffer };