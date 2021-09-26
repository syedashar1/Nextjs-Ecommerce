import nc from 'next-connect';
import Product from '../../../models/Products';
import db from '../../../utils/db';
import data from '../../../utils/data';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  await Product.deleteMany();
  await Product.insertMany(data.products);

  // for (let i = 0; i < Products.length; i++) {
  //   Products[i]._id = Products[i]._id.toString();
  //   Products[i].createdAt = Products[i].createdAt.toString();
  //   Products[i].updatedAt = Products[i].updatedAt.toString();
  // }

  await db.disconnect();
  res.send({ message: 'newly seeded successfully' });
});

export default handler;