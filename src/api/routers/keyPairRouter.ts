import express from 'express';

import { getKeyPairsList } from '../services/adminServiceClient';

export function createKeyPairRouter() {
  const keyPairRouter = express.Router();

  keyPairRouter.get('/list', async (req, res) => {
    const allKeyPairsPromise = getKeyPairsList();
    const allKeyPairs = await Promise.resolve(allKeyPairsPromise);
    return res.status(200).json(allKeyPairs);
  });

  return keyPairRouter;
}
