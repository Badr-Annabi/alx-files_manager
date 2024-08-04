import sha1 from 'sha1';
import dbClient from '../utils/db';

async function postNew(req, res) {
  // await dbClient.connect();

  const { email, password } = req.body;
  // console.log(email);
  // console.log(password);
  if (!email) {
    res.status(400).send({ error: 'Missing email' });
  }
  if (!password) {
    res.status(400).send({ error: 'Missing password' });
  }
  const existedEmail = await dbClient.usersCollection.findOne({ email });
  if (existedEmail) {
    res.status(400).send({ error: 'Already exist' });
  }
  const hashedPassword = sha1(password);
  const result = await dbClient.usersCollection.insertOne({
    email,
    password: hashedPassword,
  });
  res.status(201).json({
    id: result.insertedId,
    email,
  });
}

module.exports = postNew;
