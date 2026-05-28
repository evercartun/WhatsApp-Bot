const OpenAI = require("openai")

const { buildSystemPrompt } =
  require("./prompts")

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function generateReply({
  message,
  history
}) {

  const systemPrompt =
    buildSystemPrompt()

  const messages = [

    {
      role: "system",
      content: systemPrompt
    },

    ...history,

    {
      role: "user",
      content: message
    }
  ]

  const response =
    await client.chat.completions.create({

      model: "gpt-4.1-mini",

      messages,

      temperature: 0.9,

      max_tokens: 120
    })

  return response
    .choices[0]
    .message
    .content
}

module.exports = {
  generateReply
}