import { NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing message.' }, { status: 400 })
    }

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo', // Update if using a different model
      messages: [{ role: 'user', content: message }],
    })

    const reply = completion.data.choices[0].message?.content?.trim()

    if (!reply) {
      return NextResponse.json({ error: 'No reply from OpenAI.' }, { status: 500 })
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Error communicating with OpenAI:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    )
  }
} 