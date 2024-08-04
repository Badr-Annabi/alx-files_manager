import dbClient from '../utils/db';
import sha1 from 'sha1';

export async function postNew(req, res) {
    await dbClient.connect();

    const { email, password } = req.body;
    // console.log(email);
    // console.log(password);
    if (!email) {
        res.status(400).send({'error': 'Missing email'});
    }
    if (!password) {
        res.status(400).send({'error': 'Missing password'});
    }
    const existedEmail = await dbClient.usersCollection.findOne({ email });
    if (existedEmail) {
        res.status(400).send({'error': 'Already exist'});
    }
    const hashed_password = sha1(password);
    const result = await dbClient.usersCollection.insertOne({
        email,
        password: hashed_password
    });
    res.status(201).json({
        id: result.insertedId,
        email,
    });
}