import { Router, Response } from 'express'
import Groq from 'groq-sdk'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

router.use(authenticate)

router.post('/generate', async (req: AuthRequest, res: Response) => {
  try {
    const { prompt } = req.body
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Create a well-structured Notion page about: ${prompt}. Format it with a title, headings, bullet points and paragraphs. Return plain text only.`
      }]
    })
    const text = completion.choices[0]?.message?.content || ''
    res.json({ text })
  } catch (error: any) {
    console.error('AI Generate Error:', error.message)
    res.status(500).json({ error: error.message || 'AI generation failed' })
  }
})

router.post('/improve', async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Improve this text, make it clearer and more professional. Return only the improved text, nothing else: ${text}`
      }]
    })
    const improved = completion.choices[0]?.message?.content || ''
    res.json({ text: improved })
  } catch (error: any) {
    console.error('AI Improve Error:', error.message)
    res.status(500).json({ error: error.message || 'AI improvement failed' })
  }
})

router.post('/summarize', async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: `Summarize this content in 3-5 bullet points: ${content}`
      }]
    })
    const summary = completion.choices[0]?.message?.content || ''
    res.json({ summary })
  } catch (error: any) {
    console.error('AI Summarize Error:', error.message)
    res.status(500).json({ error: error.message || 'AI summarization failed' })
  }
})

router.post('/chat', async (req: AuthRequest, res: Response) => {
  try {
    const { message, context } = req.body
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Based on these notes: ${context || 'No context provided'}\n\nAnswer this question: ${message}`
      }]
    })
    const reply = completion.choices[0]?.message?.content || ''
    res.json({ reply })
  } catch (error: any) {
    console.error('AI Chat Error:', error.message)
    res.status(500).json({ error: error.message || 'AI chat failed' })
  }
})

router.post('/title', async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: `Suggest a short, catchy title for this content. Return only the title, nothing else: ${content}`
      }]
    })
    const title = completion.choices[0]?.message?.content || ''
    res.json({ title })
  } catch (error: any) {
    console.error('AI Title Error:', error.message)
    res.status(500).json({ error: error.message || 'AI title suggestion failed' })
  }
})

export default router