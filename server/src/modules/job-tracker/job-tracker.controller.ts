
import type { Request, Response } from 'express';
import * as jobService from './job-tracker.service';

export const create = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const job = await jobService.createJob(userId, req.body);
    res.status(201).json(job);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const findAll = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const jobs = await jobService.getJobs(userId);
    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const findOne = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const { id } = req.params as { id: string };
    const job = await jobService.getJob(userId, id);
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    res.json(job);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const { id } = req.params as { id: string };
    await jobService.updateJob(userId, id, req.body);
    res.json({ message: 'Job updated successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const { id } = req.params as { id: string };
    await jobService.deleteJob(userId, id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
