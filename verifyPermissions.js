const { donoBot } = require('./settings.json');

exports.verifyPermissions = async (sock, from, participant = "", isCommand, BOT_PHONE) => {
if (!from || typeof from !== "string") {
return {
isAdmin: false,
isBotAdmin: false,
isOwnerGroup: false,
isGroup: false,
isOwner: false
};
}

const isGroup = from.endsWith("@g.us");

const normalizeJid = (jid) => (jid || "").replace(/@c.us$/, "@s.whatsapp.net");
const normalizedParticipant = normalizeJid(participant);
const normalizedBotId = normalizeJid(BOT_PHONE);

const numberFromParticipant = normalizedParticipant.split("@")[0];
const isOwner = donoBot.includes(numberFromParticipant); 

if (!isGroup || !isCommand) {
return {
isAdmin: false,
isBotAdmin: false,
isOwnerGroup: false,
isGroup,
isOwner,
};
}

try {
const metadata = await sock.groupMetadata(from);
const { participants = [], owner = "" } = metadata || {};

const admins = participants.filter(  
  (user) => user.admin === "admin" || user.admin === "superadmin"  
);  

const isAdmin = admins.some(admin => normalizeJid(admin.id) === normalizedParticipant);  
const isBotAdmin = admins.some(admin => normalizeJid(admin.id) === normalizedBotId);  
const isOwnerGroup = owner === normalizedParticipant;  

return {  
  isAdmin,  
  isBotAdmin,  
  isOwnerGroup,  
  isGroup,  
  isOwner,  
};

} catch (error) {
return {
isAdmin: false,
isBotAdmin: false,
isOwnerGroup: false,
isGroup: false,
isOwner: false,
};
}
};

