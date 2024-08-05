import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

export const getConnect = async (req, res) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [email, password] = credentials.split(':');
  const hashedPassword = sha1(password);
  const users = dbClient.usersCollection;

  users.findOne({ email, password: hashedPassword }, async (err, user) => {
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
    }
    const token = uuidv4();
    const authKey = `auth_${token}`;
    await redisClient.set(authKey, user._id.toString(), 24 * 60 * 60);
    res.status(200).json({ token });
  });
};

export const getDisconnect = async (req, res) => {
  const token = req.headers['x-token'];
  // console.log(token);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  await redisClient.del(`auth_${token}`);
  return res.status(204).json({});
};
