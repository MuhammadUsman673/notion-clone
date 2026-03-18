import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import pageRoutes from './routes/pages'
import aiRoutes from './routes/ai'
import uploadRoutes from './routes/upload'

dotenv.config()

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://notion-clone-pi-nine.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
  }
})

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://notion-clone-pi-nine.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/pages', pageRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join-page', (pageId: string) => {
    socket.join(pageId)
  })

  socket.on('page-update', (data: { pageId: string; content: any }) => {
    socket.to(data.pageId).emit('page-updated', data.content)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export { io }