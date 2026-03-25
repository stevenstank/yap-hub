import prisma from "../lib/prisma.js";

export async function sendMessage(req, res) {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.userId;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Content is required",
      });
    }

    if (!receiverId) {
      return res.status(400).json({
        message: "receiverId is required",
      });
    }

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        senderId,
        receiverId,
      },
    });

    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getMessages(req, res) {
  try {
    const currentUserId = req.user.userId;
    const { userId } = req.params;
    const { after } = req.query;

    const where = {
      OR: [
        {
          senderId: currentUserId,
          receiverId: userId,
        },
        {
          senderId: userId,
          receiverId: currentUserId,
        },
      ],
    };

    if (after) {
      const afterDate = new Date(after);

      if (Number.isNaN(afterDate.getTime())) {
        return res.status(400).json({
          message: "Invalid after timestamp",
        });
      }

      where.createdAt = {
        gt: afterDate,
      };
    }

    const messages = await prisma.message.findMany({
      where,
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getConversations(req, res) {
  try {
    const currentUserId = req.user.userId;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId },
          { receiverId: currentUserId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const conversationsMap = new Map();

    for (const message of messages) {
      const otherUser =
        message.senderId === currentUserId ? message.receiver : message.sender;

      if (!conversationsMap.has(otherUser.id)) {
        conversationsMap.set(otherUser.id, {
          user: otherUser,
          lastMessage: {
            content: message.content,
            createdAt: message.createdAt,
          },
        });
      }
    }

    return res.status(200).json(Array.from(conversationsMap.values()));
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
