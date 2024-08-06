import { ObjectId } from 'mongodb';
import redisClient from './redis';
import dbClient from './db';


export const getUserByToken = async (req) => {
  const token = req.headers['x-token'];
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
    } else {
      const authKey = `auth_${token}`;
      const userId = await redisClient.get(authKey);
      if (userId) {
        dbClient.usersCollection.findOne({ _id: new ObjectId(userId) }, (err, user) => {
          if (user) {
            return user;
          } else {
            return null;
          }
        });
      } else {
        return null;
      }
    }
}
