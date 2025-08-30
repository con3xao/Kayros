const { PREFIX } = require("./settings.json");

exports.extractMessages = (messageDetails, sock) => {
  const extendedTextMessage = messageDetails?.message?.extendedTextMessage?.text;
  const textConversation = messageDetails?.message?.conversation;
  const finalMessageText = extendedTextMessage || textConversation || "";

  const from = messageDetails?.key?.remoteJid;
  const isCommand = finalMessageText.startsWith(PREFIX);
  const commandName = isCommand
    ? finalMessageText.slice(1).trim().split(/\s+/).shift().toLowerCase()
    : "";

  const args = isCommand
    ? finalMessageText.trim().split(/\s+/).slice(1)
    : [];

  const userName = messageDetails?.pushName || "";
  const participant = messageDetails?.key?.remoteJid.includes("@g.us")
    ? messageDetails?.key?.participant
    : messageDetails?.key?.remoteJid;

  const contextInfo = messageDetails?.message?.extendedTextMessage?.contextInfo || {};
  const userMention = contextInfo.mentionedJid?.[0] || contextInfo.participant || null;
  const numberUserMention = userMention?.split("@")[0] || null;

  const BOT_PHONE = sock?.user?.id?.split(":")[0] + "@s.whatsapp.net";
  
  const message = messageDetails.message;
  const text = finalMessageText;

  return {
    BOT_PHONE,
    finalMessageText,
    from,
    isCommand,
    commandName,
    args,
    userName,
    participant,
    userMention,
    numberUserMention,
    message,
    text
  };
};