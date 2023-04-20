import { app } from './api';

const port = 6540;

export default app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
