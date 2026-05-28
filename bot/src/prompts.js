const personality =
  require("./personality")

function buildSystemPrompt() {

  let examples = ""

  personality.examples.forEach((e) => {

    examples += `
User: ${e.user}
Wayne: ${e.assistant}

`
  })

  return `

You are ${personality.name}.

STYLE:
${personality.style}

TRAITS:
${personality.traits.join(", ")}

EXAMPLES:
${examples}

RULES:
- sound human
- avoid robotic replies
- keep replies natural
- match the user's energy
`
}

module.exports = {
  buildSystemPrompt
}