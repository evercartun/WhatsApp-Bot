const fs = require("fs")

const {
  saveMessage
} = require("./memory")

async function importChats() {

  const raw =
    fs.readFileSync(
      "./data/chat.txt",
      "utf-8"
    )

  const lines =
    raw.split("\n")

  for (const line of lines) {

    if (!line.includes(":")) continue

    const parts =
      line.split(":")

    const sender =
      parts[0].trim()

    const content =
      parts.slice(1).join(":").trim()

    await saveMessage({

      sender,

      role:
        sender === "Wayne"
          ? "assistant"
          : "user",

      content
    })
  }

  console.log(
    "✅ Chats imported"
  )
}

importChats()