import prisma from "../lib/prisma.js";

export async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        profilePicture: true,
        bio: true,
        createdAt: true,
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getUserById(req, res) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicture: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { username, bio, profilePicture } = req.body;

    if (req.user.userId !== id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username,
        bio,
        profilePicture,
      },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicture: true,
        bio: true,
        createdAt: true,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
