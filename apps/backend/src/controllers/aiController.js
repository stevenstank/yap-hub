import { GoogleGenAI } from '@google/genai'

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ reply: 'Message is required' })
    }

    console.log('Incoming message:', message)

    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
    })

    const reply =
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'AI gave no response'

    return res.json({ reply })
  } catch (error) {
    console.error('AI ERROR FULL:', error)

    const fallbackReplies = [
      'AI is tired right now 😅 try later',
      'Server overloaded, come back in a bit',
      'AI quota finished ⚠️',
      'Something broke, but I am still here 👀',
    ]

    const randomReply =
      fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)]

    return res.status(200).json({ reply: randomReply })
  }
}
