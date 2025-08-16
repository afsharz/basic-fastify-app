import { hashPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { CreateUserSchema } from "./user.schema";

export const createUser = async (input: CreateUserSchema) => {
  const { password, ...rest } = input;
  const { hash, salt } = hashPassword(password);
  try {
    const user = await prisma.user.create({
      data: { ...rest, salt, password: hash },
    });
    return user;
  } catch (err) {
    console.log(err);
  }
};

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function findUsers() {
  return prisma.user.findMany({
    select: {
      email: true,
      name: true,
      id: true,
      salt: false,
    },
  });
}
