import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import data from '../../utils/data';
import NextLink from 'next/link';
import Image from 'next/image';
import { Grid,Link,List,ListItem,Typography, Card,Button,} from '@material-ui/core';
import Layout from '../../component/Layout';
import useStyles from '../../utils/styles';
import db from '../../utils/db';
import Product from '../../models/Products';
import axios from 'axios';
import { Store } from '../../utils/store';

export default function ProductScreen(props) {

  const router = useRouter();
  const classes = useStyles();
  const {product} = props
  const { state, dispatch } = useContext(Store);


  const addToCartHandler = async () => {

    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock <= quantity ) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };


  if (!product) {
    return <div>Product Not Found</div>;
  }
  return (
    <div>
      <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <NextLink href="/" passHref>
          <Link>
            <Typography>back to products</Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={5} xs={12}>
          <img
            src={product.image}
            alt={product.name}
            style={{  width : '100%'}}
          ></img>
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h1">{product.name}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Rating: {product.rating} stars ({product.numReviews} reviews)
              </Typography>
            </ListItem>
            <ListItem>
              <Typography> Description: {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>${product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {product.countInStock > 0 ? 'In stock' : 'Unavailable'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button fullWidth variant="contained" color="primary" onClick={addToCartHandler}>
                  Add to cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
    </div>
  );
}



export async function getServerSideProps(context) {
  const { params } = context;
  const { _id } = params;
  console.log(params);

  await db.connect();
  const product = await Product.findById(_id).lean();
  console.log(product);
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}