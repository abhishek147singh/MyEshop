import { Card, Container, Grid, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import CheckoutSteps from '../componets/CheckoutSteps';
import { Store } from '../Store';

const reducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_REQUEST':
            return { ...state, loading: true };
        case 'CREATE_SUCCESS':
            return { ...state, loading: false };
        case 'CREATE_FAIL':
            return { ...state, loading: false };
        default:
            return state;
    }
}


export default function PlaceOrderScreen() {

    const [{ loading, error }, dispatch] = useReducer(reducer, { loading: false, error: "" });
    const { state, dispatch:ctxDispatch } = useContext(Store);
    const { cart: { paymentMethod, shippingAddress, cartItems }, userInfo } = state;

    const navigate = useNavigate();

    const placeOrderHandler = async () => {
        try {
            dispatch({ type: 'CREATE_REQUEST' });
            const { data } = await axios.post("/api/orders", {
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemsPrice: ItemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            }, {
                headers: {
                    authorization: userInfo.token,
                }
            });
            
            ctxDispatch({ type: 'CART_CLEAR' });
            dispatch({ type: 'CREATE_SUCCESS' });
            localStorage.removeItem('cartItems');
            navigate(`/order/${data.order._id}`);
        } catch (err) {
            dispatch({ type: 'CREATE_FAIL' });
            alert("Error : " + err);
        }
    };

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

    const ItemsPrice = round2(cartItems.reduce((a, c) => a + c.quantity * c.price, 0));
    const shippingPrice = round2(ItemsPrice > 100 ? round2(0) : round2(10));
    const taxPrice = round2(0.15 * ItemsPrice);//15% tax
    const totalPrice = ItemsPrice + shippingPrice + taxPrice;

    useEffect(() => {
        if (!paymentMethod) {
            navigate("/payment");
        }
    }, [paymentMethod, navigate]);

    return (
        <div className='main '>
            {loading ? (<div className='center'> <CircularProgress /> </div>)
                : error ? (<Alert> {error}</Alert>)
                    : (
                        <>
                            <div className='center2'>
                                <CheckoutSteps step1 step2 step3 step4 />
                            </div>
                            <h1 style={{ marginLeft: "1rem" }}>Preview Order</h1>
                            <Grid container item >
                                <Grid container item md={8} >
                                    <Container maxWidth="md">
                                        <Card style={{ paddingLeft: "10px", marginTop: "10px" }}>
                                            <h2>Shipping</h2>
                                            <p> <strong>Name</strong> : {shippingAddress.fullName} </p>
                                            <p><strong>Address</strong> : {shippingAddress.address} , {shippingAddress.city} , {shippingAddress.postalCode} , {shippingAddress.country}</p>
                                            <Link style={{ color: "#000", marginBottom: "10px" }} to="/shipping"><h3>Edit </h3></Link>
                                        </Card>

                                        <Card style={{ paddingLeft: "10px", marginTop: "10px" }}>
                                            <h2>Payment</h2>
                                            <p> <strong>Method</strong> : {paymentMethod} </p>
                                            <Link style={{ color: "#000", marginBottom: "10px" }} to="/payment"><h3>Edit </h3></Link>
                                        </Card>
                                        <Card style={{ paddingLeft: "10px", paddingRight: "10px", marginTop: "10px" }}>
                                            <h2>Items</h2>
                                            <List>
                                                {
                                                    cartItems.map(item => {
                                                        return (
                                                            <ListItem key={item._id} style={{ margin: "5px", paddingLeft: "0px", borderRadius: "5px", boxShadow: "1px 1px rgba(0 , 0 , 0 , 0.2)" }}>
                                                                <Grid item xs={8}>
                                                                    <List>
                                                                        <ListItem>
                                                                            <ListItemAvatar>
                                                                                <Avatar alt={item.name} src={item.imageSrc} />
                                                                            </ListItemAvatar>
                                                                            <ListItemText >
                                                                                <Link style={{ color: "#000" }} to={`/products/${item._id}`}>{item.name}</Link>
                                                                            </ListItemText>
                                                                        </ListItem>
                                                                    </List>
                                                                </Grid>
                                                                <Grid item xs={2} >
                                                                    <span>{item.quantity}</span>
                                                                </Grid>
                                                                <Grid item xs={2}>
                                                                    <div style={{ color: "#000" }} to={`/products/${item._id}`}>$ {item.price}</div>
                                                                </Grid>
                                                            </ListItem>
                                                        );
                                                    })
                                                }
                                            </List>
                                        </Card>
                                    </Container>
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Container maxWidth="md">
                                        <Card style={{ paddingLeft: "10px", marginTop: "10px" }}>
                                            <h2>Order Summary</h2>
                                            <div className='space-between'>
                                                <div><strong>Items Price </strong></div>
                                                <div>{ItemsPrice.toFixed(2)}</div>
                                            </div>
                                            <div className='space-between'>
                                                <div><strong>Shipping Price </strong></div>
                                                <div>{shippingPrice.toFixed(2)}</div>
                                            </div>
                                            <div className='space-between'>
                                                <div><strong>Tax  </strong></div>
                                                <div>{taxPrice.toFixed(2)}</div>
                                            </div>
                                            <div className='space-between'>
                                                <div><strong>Total Price </strong></div>
                                                <div>{totalPrice.toFixed(2)}</div>
                                            </div>
                                            <div className='space-between'>
                                                <Button type='button' variant="contained" color="inherit" onClick={placeOrderHandler} disabled={cartItems.length === 0} >Place Order</Button>
                                            </div>
                                        </Card>
                                    </Container>
                                </Grid>
                            </Grid>
                        </>
                    )}
        </div>
    )
}
