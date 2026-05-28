const prisma = require("./db")

async function saveMessage({
  sender,
  role,
  content
}) {

  return prisma.message.create({
    data: {
      sender,
      role,
      content
    }
  })
}

async function getRecentMessages(sender, limit = 15) {

  const messages =
    await prisma.message.findMany({

      where: {
        sender
      },

      orderBy: {
        createdAt: "desc"
      },

      take: limit
    })

  return messages
    .reverse()
    .map(msg => ({
      role: msg.role,
      content: msg.content
    }))
}

async function clearMemory(sender) {

  return prisma.message.deleteMany({
    where: {
      sender
    }
  })
}

module.exports = {
  saveMessage,
  getRecentMessages,
  clearMemory
}