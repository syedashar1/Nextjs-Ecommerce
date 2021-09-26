import {
List,
ListItem,
Typography,
TextField,
Button,
Link,
} from '@material-ui/core';
import axios from 'axios';
import NextLink from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../component/Layout';
import useStyles from '../utils/styles';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { Store } from '../utils/store';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';


export default function Login() {


        const router = useRouter();
        const { redirect } = router.query; // login?redirect=/shipping
        const { state, dispatch } = useContext(Store);
        const { userInfo } = state;
        useEffect(() => {
          if (userInfo) {
            router.push('/');
          }
        }, []);
        const { enqueueSnackbar, closeSnackbar } = useSnackbar();

        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const submitHandler = async (e) => {
                
                closeSnackbar();
                e.preventDefault();

                try {
                  const { data } = await axios.post('/api/users/login', {
                    email,
                    password,
                  });
                  dispatch({ type: 'USER_LOGIN', payload: data });
                  Cookies.set('userInfo', JSON.stringify(data));
                  router.push(redirect || '/');

                  

                } catch (err) {
                        enqueueSnackbar(getError(err), { variant: 'error' });
                }
              };

        const classes = useStyles();
        return (
                <Layout title="Login">
                <form onSubmit={submitHandler} className={classes.form}>
                <Typography component="h1" variant="h1">Login</Typography>
                <List>
                <ListItem>
                        <TextField
                        variant="outlined"
                        fullWidth
                        id="email"
                        label="Email"
                        inputProps={{ type: 'email' }}
                        onChange={(e) => setEmail(e.target.value)}
                        ></TextField>
                </ListItem>
                <ListItem>
                        <TextField
                        variant="outlined"
                        fullWidth
                        id="password"
                        label="Password"
                        inputProps={{ type: 'password' }}
                        onChange={(e) => setPassword(e.target.value)}
                        ></TextField>
                </ListItem>
                <ListItem>
                        <Button variant="contained" type="submit" fullWidth color="primary">
                        Login
                        </Button>
                </ListItem>
                <ListItem>
                        Don't have an account? &nbsp;
                        <NextLink href={`/register?redirect=${redirect || '/'}`} passHref>
                        <Link>Register</Link>
                        </NextLink>
                </ListItem>
                </List>
                </form>
                </Layout>
        );
        }