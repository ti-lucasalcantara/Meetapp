import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

const routes = new Router();

routes.get('/', (req, res, next) => {
  return res.json({ message: 'Hello world' });
});

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Auth
routes.put('/users', UserController.update);

export default routes;
