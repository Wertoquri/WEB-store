import prisma from '../db.js';

export const getMessages = async (req, res) => {
  try {
    const userId = req.user.userId;

    const messages = await prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const message = await prisma.message.findUnique({
      where: { id: parseInt(id) }
    });

    if (!message || message.userId !== userId) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await prisma.message.update({
      where: { id: parseInt(id) },
      data: { isRead: true }
    });

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
};
