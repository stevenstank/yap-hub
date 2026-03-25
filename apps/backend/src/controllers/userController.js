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
