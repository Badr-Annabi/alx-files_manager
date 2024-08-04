import sha1 from 'sha1';
import dbClient from '../utils/db';

async function postNew(req, res) {
  // await dbClient.connect();

  const { email } = req.body;
  const { password } = req.body;
  //   console.log(email);
  //   console.log(password);
  if (!email) {
    res.status(400).json({ error: 'Missing email' });
    return;
  }
  if (!password) {
    res.status(400).json({ error: 'Missing password' });
    return;
  }
  const users = dbClient.usersCollection;
  users.findOne({ email }, (err, user) => {
    if (user) {
      res.status(400).json({ error: 'Already exist' });
    } else {
      const hashedPassword = sha1(password);
      users.insertOne(
        {
          email,
          password: hashedPassword,
        },
      ).then((result) => {
        res.status(201).json({ id: result.insertedId, email });
      }).catch((error) => console.log(error));
    }
  });
}

module.exports = postNew;
