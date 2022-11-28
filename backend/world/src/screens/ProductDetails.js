import axios from 'axios';
import React, { useContext, useState } from 'react'
import { useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { Stack, ListItem, Card, Button, CircularProgress, Alert, Container, FormGroup, FormControl, TextField, IconButton, ListItemAvatar, List, Avatar, ListItemText, Typography } from '@mui/material';
import Rating from "../componets/Rating";
import { Store } from '../Store';
import StarRateIcon from '@mui/icons-material/StarRate';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };

    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'REVIEWS_REQUEST':
      return { ...state, reviewLoading: true };

    case 'REVIEWS_SUCCESS':
      return { ...state, reviews: action.payload, reviewLoading: false };

    case 'REVIEWS_FAIL':
      return { ...state, reviewLoading: false, reviewError: action.payload };

    case 'SAVE_REVIEWS_REQUEST':
      return { ...state, saveLoading: true };

    case 'SAVE_REVIEWS_SUCCESS':
      return { ...state, saveLoading: false, reviews: [...state.reviews, action.payload] };

    case 'SAVE_REVIEWS_FAIL':
      return { ...state, saveLoading: false, saveError: action.payload };
    default:
      return state;
  }
}

export default function ProductDetails() {
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  const [{ loading, error, product, reviewError, reviewLoading, reviews, saveError, saveLoading }, dispatch] =
    useReducer(reducer, { loading: true, error: "", product: [], saveError: '', saveLoading: false, reviews: [], reviewLoading: false, reviewError: '' });

  useEffect(() => {

    const fetch = async () => {
      dispatch({ type: 'FETCH_REQUEST' })
      try {
        const getData = await axios.get(`/api/products/${id}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: getData.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }

      dispatch({ type: 'REVIEWS_REQUEST' });
      try {
        const getData = await axios.get(`/api/reviews/${id}`);
        dispatch({ type: 'REVIEWS_SUCCESS', payload: getData.data });
      } catch (error) {
        dispatch({ type: 'REVIEWS_FAIL', payload: error.message });
      }
    }
    fetch();

  }, [id]);

  const saveCommentHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "SAVE_REVIEWS_REQUEST" });
    try {
      const { data } = await axios.post('/api/reviews/', {
        rating: rating,
        comment: comment,
        product: id,
      }, {
        headers: { authorization: userInfo.token }
      });
      dispatch({ type: "SAVE_REVIEWS_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "SAVE_REVIEWS_FAIL", payload: err.message });
    }
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find(item => item._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      window.alert("Sorry , Product is out of stock !!");
    } else {
      ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity: quantity } });
    }

    navigate('/cart');
  }

  return (
    <main className='main'>{loading ? (<div className='center'> <CircularProgress /> </div>)
      : error ? (<Alert severity="error">{error}</Alert>) :
        (
          <div>
            <Grid item container spacing={2} >
              <Grid item md={6} sm={6} xs={12}>
                <div className='center'>
                  <img className='img-large' src={`../${product.imageSrc}`} alt={product.name} />
                </div>
              </Grid>
              <Grid item md={3} sm={6} xs={12}>
                <Stack spacing={1}>
                  <ListItem> <h1> {product.name}</h1></ListItem>
                  <ListItem><Rating rating={product.rating} /></ListItem>
                  <ListItem><strong> Price : </strong> $ {product.price} </ListItem>
                  <ListItem><strong> Discreption :</strong></ListItem>
                  <ListItem>{product.discreption} </ListItem>
                </Stack>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <div className='center'>
                  <Container maxWidth="md">
                    <Card style={{ paddingLeft: "10px", marginTop: "10px" }}>
                      <h2>Order Summary</h2>
                      <div className='space-between'>
                        <div><strong>Price : </strong></div>
                        <div>$ {product.price}</div>
                      </div>
                      <div className='space-between'>
                        <div><strong>Status : </strong></div>
                        <div>
                          {
                            product.countInStock > 0 ? (
                              <span style={{ backgroundColor: "lightgreen", borderRadius: "10%", padding: "3px", marginLeft: "10px" }}>In Stock </span>)
                              : (<span style={{ backgroundColor: "orange", borderRadius: "10%", padding: "3px", marginLeft: "10px" }}>Unavailable </span>)
                          }
                        </div>
                      </div>
                      <div className='space-between'>
                        {
                          product.countInStock > 0 ? (<Button onClick={addToCartHandler} size='small' variant="contained" color="inherit">Add to cart</Button>)
                            : (<Button disabled onClick={addToCartHandler} size='small' variant="contained" color="inherit">Add to cart</Button>)
                        }
                      </div>
                    </Card>
                  </Container>
                </div>
              </Grid>
            </Grid>
            <Grid container item spacing={2}>
              <Grid item md={8} sm={10} xs={12}>
                <Card sx={{ p: '10px' }}>
                  <h3>Give your review</h3>
                  {
                    saveLoading ? <CircularProgress /> :
                      saveError !== '' ? <Alert severity='error' >{saveError}</Alert> : null
                  }
                  <Alert ></Alert>
                  <form onSubmit={saveCommentHandler}>
                    <div>
                      <IconButton onClick={() => setRating(1)}>
                        {
                          rating >= 1 ? (<StarRateIcon />) : (<StarOutlineIcon />)
                        }
                      </IconButton>
                      <IconButton onClick={() => setRating(2)}>
                        {
                          rating >= 2 ? (<StarRateIcon />) : (<StarOutlineIcon />)
                        }
                      </IconButton>
                      <IconButton onClick={() => setRating(3)}>
                        {
                          rating >= 3 ? (<StarRateIcon />) : (<StarOutlineIcon />)
                        }
                      </IconButton>
                      <IconButton onClick={() => setRating(4)}>
                        {
                          rating >= 4 ? (<StarRateIcon />) : (<StarOutlineIcon />)
                        }
                      </IconButton>
                      <IconButton onClick={() => setRating(5)}>
                        {
                          rating >= 5 ? (<StarRateIcon />) : (<StarOutlineIcon />)
                        }
                      </IconButton>

                    </div>
                    <FormGroup>
                      <FormControl>
                        <TextField
                          label="Comment"
                          type="text"
                          size='sm'
                          style={{ margin: "10px" }}
                          onChange={(e) => setComment(e.target.value)}
                          value={comment}
                        />
                      </FormControl>
                    </FormGroup>
                    <Button sx={{ ml: "10px" }} type='submit' size='large' variant="contained" color="inherit" >Save</Button>
                  </form>
                </Card>
              </Grid>
              <Grid item md={8} sm = {10} xs={12}>
                <h2>Reviews</h2>
                {
                  reviewLoading ? <CircularProgress />
                    : reviewError ? <Alert severity='error' >{reviewError}</Alert>
                      : (
                        <List>
                          {
                            reviews.map(review => {
                              return (

                                 <ListItem key={review._id} alignItems="flex-start" style={{ boxShadow :"1px 2px rgba(0 , 0 , 0 , 0.2)" }} >
                                    <ListItemAvatar>
                                      <Avatar alt={review.writerName} src="" />
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={review.writerName}
                                      secondary={
                                        <React.Fragment>
                                          <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                          >
                                            {review.comment}
                                          </Typography>
                                        </React.Fragment>
                                      }
                                    />
                                   <Rating rating={review.rating} />
                                  </ListItem>
                                
                               
                              );
                            })
                          }
                        </List>
                      )
                }
              </Grid>
            </Grid>
          </div>
        )
    }
    </main>
  )
}
