import Head from 'next/head'
import Image from 'next/image'
import Layout from '../component/Layout'
import styles from '../styles/Home.module.css'
import {Grid,Card,CardActionArea,CardMedia,CardContent,Typography,CardActions,Button,Link} from '@material-ui/core';
import data from '../utils/data';
import NextLink from 'next/link';
import db from '../utils/db';
import Product from '../models/Products';
import { useContext } from 'react';
import { Store } from '../utils/store';
import axios from 'axios';
import Fade from 'react-reveal/Fade';
import { useRouter } from 'next/router';
import Carousel from 'react-material-ui-carousel';
import useStyles from '../utils/styles';
export default function Home(props) {


  const { products } = props;
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const classes = useStyles();

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };


  return (
    <Layout>

      <Carousel className={classes.mt1} animation="slide">
        {['/images/banner1.jpg' , '/images/banner2.jpg'].map((product) => (
          <NextLink
            key={product}
            href={`/search`}
            passHref
          >
            <Link>
              <img
                src={product}
                className={classes.featuredImage}
                style={{width:'100%'}}
              ></img>
            </Link>
          </NextLink>
        ))}
      </Carousel>



      <div>
      <h1>Top Sellers</h1>
        <Grid container spacing={3}>
          {products.map((product) => (
            
            <Grid item md={4} key={product.name}>
              <Fade bottom cascade>
              <Card>
              <NextLink href={`/product/${product._id}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.image}
                      title={product.name}
                    ></CardMedia>
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>${product.price}</Typography>
                  <Button size="small" color="primary" onClick={()=>addToCartHandler(product)}>
                    Add to cart
                  </Button>
                </CardActions>
              </Card></Fade>
            </Grid>
            
          ))}
        </Grid>
    </div>
    </Layout>
  )
}


export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}).lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}