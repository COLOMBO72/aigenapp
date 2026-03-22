import { Router, Request, Response, IRouter } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import * as generateService from './generate.service.js';
import { GenerateRequest } from './generate.types.js';

export const generateRouter: IRouter = Router();

// Все роуты генерации требуют авторизации
generateRouter.use(authMiddleware);

// ─── POST /api/generate ────────────────────────────────────────────
generateRouter.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body as GenerateRequest;

    if (!body.prompt || body.prompt.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Prompt is required',
      });
      return;
    }

    if (body.prompt.length > 1000) {
      res.status(400).json({
        success: false,
        error: 'Prompt is too long (max 1000 characters)',
      });
      return;
    }

    const result = await generateService.createGeneration(req.user!, body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Generation failed';
    res.status(400).json({
      success: false,
      error: message,
    });
  }
});

// ─── GET /api/generate/history ─────────────────────────────────────
generateRouter.get('/history', async (req: Request, res: Response) => {
  try {
    const generations = await generateService.getUserGenerations(req.user!.userId);
    res.status(200).json({
      success: true,
      data: generations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch history',
    });
  }
});

// ─── GET /api/generate/:id ─────────────────────────────────────────
generateRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const generation = await generateService.getGeneration(req.params.id, req.user!.userId);
    res.status(200).json({
      success: true,
      data: generation,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: 'Generation not found',
    });
  }
});
