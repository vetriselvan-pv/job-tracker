
import { prisma } from '../../config/prisma';

export const createJob = async (userId: string, data: any) => {
  return prisma.jobTracker.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const getJobs = async (userId: string) => {
  return prisma.jobTracker.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getJob = async (userId: string, jobId: string) => {
  return prisma.jobTracker.findFirst({
    where: { id: jobId, userId },
  });
};

export const updateJob = async (userId: string, jobId: string, data: any) => {
  return prisma.jobTracker.updateMany({
    where: { id: jobId, userId },
    data,
  });
};

export const deleteJob = async (userId: string, jobId: string) => {
  return prisma.jobTracker.deleteMany({
    where: { id: jobId, userId },
  });
};
