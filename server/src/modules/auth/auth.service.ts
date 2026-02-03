
import bcrypt from 'bcrypt';
import { prisma } from '../../config/prisma'; 

export const createUser = async (data: any) => {
  const { email, password, name } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
    },
  });
};

export const updateUser = async (id: string, data: any) => {
  const { email, password } = data;
  const updateData: any = {};

  if (email) updateData.email = email;
  if (password) {
    updateData.passwordHash = await bcrypt.hash(password, 10);
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
  });
};

import jwt from 'jsonwebtoken';
    
// ... existing imports

export const login = async (data: any) => {
  const { email, password } = data;
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '7d',
  });

  return { user, token };
};

export const deleteUser = async (id: string) => {
  return prisma.user.delete({
    where: { id },
  });
};
