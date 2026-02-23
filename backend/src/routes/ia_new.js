import express from 'express';
import IaKnowledge from '../models/IaKnowledge.js';
import IaConversation from '../models/IaConversation.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
