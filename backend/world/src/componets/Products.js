import React, { useContext } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { Store } from '../Store';
import axios from 'axios';
import Rating from './Rating';
import { Link} from 'react-router-dom';

export default function MultiActionAreaCard(props) {
    const { _id, name, discreption, rating, noReviews, price, imageSrc, countInStock } = props.product;
    const { state, dispatch: ctxDispatch } = useContext(Store);

    const addToCartHandler = async () => {
        const existItem = state.cart.cartItems.find(item => item._id === _id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${_id}`);
        if (data.countInStock < quantity) {
            window.alert("Sorry , Product is out of stock !!");
        } else {
            ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...props.product, quantity: quantity } });
        }
    }

    const path = window.location.origin + imageSrc;

    return (
        <Card sx={{ m: 1, maxWidth: 345 }}>
            <CardActionArea>
                <Link to={`/products/${_id}`}>
                    <CardMedia
                        component="img"
                        sx={{ objectFit: "contain" }}
                        width="320"
                        height="200"
                        image={path}
                        alt={name}
                    />
                </Link>
                <CardContent>

                    <Link style={{color:"#000"}} to={`/products/${_id}`}>
                        <Typography gutterBottom variant="h5" component="div">
                            {name}
                        </Typography>
                    </Link>

                    <Typography variant='body2'>
                        Price : $ {price}
                    </Typography>
                    <div className='flex'>
                        <div className='flex'>
                            <div>
                                Rating :
                            </div>
                            <div>
                                <Rating rating={rating} font={18} />
                            </div>
                        </div>
                        <div>Reviews : {noReviews}</div>
                    </div>
                    <p>Descreption</p>
                    <Typography variant="body2" color="text.secondary">
                        {discreption}
                    </Typography>
                </CardContent>

            </CardActionArea>
            <CardActions>

                {
                    countInStock > 0 ? (<Button onClick={addToCartHandler} size='small' variant="outlined" color="inherit">Add to cart</Button>)
                        : (<Button disabled onClick={addToCartHandler} size='small' variant="contained" color="inherit">Add to cart</Button>)
                }
            </CardActions>
        </Card>
    );
}

