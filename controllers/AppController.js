import redisClient from '../utils/redis';
import dbClient from '../utils/db';

export const getStatus = async (req, res) => {
  if (dbClient.isAlive() && redisClient.isAlive()) {
    res.json({ redis: true, db: true }).status(200);
  }
};

export const getStats = async (req, res) => {
  const numUsers = await dbClient.nbUsers();
  const numFiles = await dbClient.nbFiles();
  res.json({ users: numUsers, files: numFiles }).status(200);
};

// module.exports = {
//   getStats,
//   getStatus,
// };
