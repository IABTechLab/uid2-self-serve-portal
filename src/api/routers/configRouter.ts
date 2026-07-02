import { Router } from 'express';

import { currentIdentity, docsBaseUrl, logoAsset, productName } from '../identity';

export const configRouter = Router();

configRouter.get('/', (_req, res) => {
  res.json({
    identity: currentIdentity(),
    productName: productName(),
    docsBaseUrl: docsBaseUrl(),
    logo: { light: logoAsset('light'), dark: logoAsset('dark') },
  });
});
