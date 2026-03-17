import { Router, Response } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()

router.use(authenticate)

// Get all pages for user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const pages = await prisma.page.findMany({
      where: { userId: req.userId!, isDeleted: false },
      orderBy: { createdAt: 'asc' }
    })
    res.json({ pages })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// Get trashed pages
router.get('/trash', async (req: AuthRequest, res: Response) => {
  try {
    const pages = await prisma.page.findMany({
      where: { userId: req.userId!, isDeleted: true },
      orderBy: { updatedAt: 'desc' },
    })
    res.json({ pages })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trash' })
  }
})

// Get single page
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const page = await prisma.page.findFirst({
      where: { id: req.params.id, userId: req.userId!, isDeleted: false },
      include: { children: { where: { isDeleted: false } } }
    })
    if (!page) return res.status(404).json({ error: 'Page not found' })
    res.json({ page })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// Create page
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { title, icon, parentId } = req.body
    const page = await prisma.page.create({
      data: {
        title: title || 'Untitled',
        icon: icon || '📄',
        parentId: parentId || null,
        userId: req.userId!,
        content: { blocks: [] }
      }
    })
    res.status(201).json({ page })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// Update page
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { title, icon, content } = req.body
    const page = await prisma.page.update({
      where: { id: req.params.id },
      data: { title, icon, content }
    })
    res.json({ page })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// Restore page from trash — BEFORE /:id delete
router.patch('/:id/restore', async (req: AuthRequest, res: Response) => {
  try {
    const page = await prisma.page.update({
      where: { id: req.params.id },
      data: { isDeleted: false },
    })
    res.json({ page })
  } catch (error) {
    res.status(500).json({ error: 'Failed to restore page' })
  }
})

// Permanently delete page — BEFORE /:id delete
router.delete('/:id/permanent', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.page.delete({ where: { id: req.params.id } })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete page' })
  }
})

// Soft delete page — AFTER permanent
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.page.update({
      where: { id: req.params.id },
      data: { isDeleted: true }
    })
    res.json({ message: 'Page deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router