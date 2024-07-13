import { Router } from 'express';

const routes = Router();

routes.get('/api/appointment', (request, response) =>
  console.log("get")
);

routes.get('/api/appointment/:id', (request, response) =>
    console.log("getone")
);

routes.post('/api/appointment', (request, response) =>
    console.log("post")
);

routes.put('/api/appointment/:id', (request, response) =>
    console.log("put")
);

routes.delete('/api/appointment/:id', (request, response) =>
    console.log("delete")
);

export default routes;