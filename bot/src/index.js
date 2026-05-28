const path = require("path")
require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
})

const {
  default: makeWASocket,
  useMultiFileAuthState
} = require("@whiskeysockets/baileys")

const qrcode =
  require("qrcode-terminal")

const { generateReply } =
  require("./ai")

const {
  saveMessage,
  getRecentMessages
} = require("./memory")

async function startBot() {

  const { state, saveCreds } =
    await useMultiFileAuthState(
      "auth_info"
    )

  const sock = makeWASocket({
    auth: state
  })

  sock.ev.on(
    "creds.update",
    saveCreds
  )

  sock.ev.on(
    "connection.update",
    ({ qr, connection }) => {

      if (qr) {

        qrcode.generate(qr, {
          small: true
        })
      }

      if (connection === "open") {
        console.log(
          "✅ WhatsApp connected"
        )
      }
    }
  )

  sock.ev.on(
    "messages.upsert",

    async ({ messages }) => {

      const msg = messages[0]

      if (!msg.message) return

      const sender =
        msg.key.remoteJid

      const text =
        msg.message.conversation || ""

      if (!text) return

      console.log("📩", text)

      await saveMessage({
        sender,
        role: "user",
        content: text
      })

      const history =
        await getRecentMessages(sender)

      const reply =
        await generateReply({
          message: text,
          history
        })

      await saveMessage({
        sender,
        role: "assistant",
        content: reply
      })

      const delay =
        Math.random() * 4000 + 1000

      setTimeout(async () => {

        await sock.sendMessage(
          sender,
          { text: reply }
        )

      }, delay)
    }
  )
}

startBot()