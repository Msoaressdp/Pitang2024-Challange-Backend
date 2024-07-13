import express from 'express';

const PORT = process.env.PORT || 5000;

const server = express();

server.use(express.json());

server.listen(PORT, () => {
  console.log(`Running at localhost${PORT}`);
});