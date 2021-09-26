import nc from 'next-connect';
import User from '../../models/User';
import db from '../../utils/db';
import data from '../../utils/data';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  await User.deleteMany();
  console.log(data.users);
  await User.insertMany(data.users);
  await db.disconnect();
  res.send({ message: 'newly seeded successfully' });
});

export default handler;