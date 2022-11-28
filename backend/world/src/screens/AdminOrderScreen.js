import React, { useContext, useEffect, useReducer } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { Store } from "../Store";
import axios from 'axios';
import { Alert, Avatar, Card, CircularProgress, Container, Grid, List, ListItem, ListItemAvatar, ListItemText, Button } from '@mui/material';

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
}

const updateReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loadingUpdate: true, errorUpdate: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loadingUpdate: false, updated: true };
        case 'FETCH_FAIL':
            return { ...state, loadingUpdate: false, updated: false, errorUpdate: action.payload };
        default:
            return state;
    }
}


export default function AdminOrderScreen() {

    const [{ loading, error, order }, dispatch] = useReducer(reducer, { loading: false, error: "", order: {} });

    const { state } = useContext(Store);
    const { userInfo } = state;

    const navigate = useNavigate();

    const params = useParams();
    const { id: orderId } = params;

    const [{ loadingUpdate, errorUpdate, updated }, dispatchUpdate] = useReducer(updateReducer, { loadingUpdate: false, errorUpdate: '', updated: false });

    const updateData = async () => {
        try {
            dispatchUpdate({ type: 'FETCH_REQUEST' })
            const { data } = await axios.put(`/api/orders/admin/order/${orderId}`, {}, {
                headers: { Authorization: userInfo.token }
            });
            dispatchUpdate({ type: 'FETCH_SUCCESS' });
            dispatch({ type: 'FETCH_SUCCESS', payload: data.order });
            navigate(`/admin/order/${data.order._id}`);
        } catch (err) {
            dispatchUpdate({ type: 'FETCH_FAIL', payload: err.message });
        }
    }

    useEffect(() => {

        const fetchOrder = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await axios.get(`/api/orders/admin/order/${orderId}`, {
                    headers: { authorization: userInfo.token }
                });

                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }
        }

        if (!order._id || (order._id && order._id !== orderId)) {
            fetchOrder();
        }

    }, [userInfo, navigate, order, orderId]);

    return (
        <div className='main'>
            {
                (loading) ? (<div className='center'> <CircularProgress /> </div>)
                    : error ? (<Alert> {error} </Alert>)
                        : (
                            <div>
                                <h1 style={{ marginLeft: "1rem" }}> Order : {orderId} </h1>
                                {order._id !== undefined ? (
                                    <Grid container item >
                                        <Grid container item md={8} >
                                            <Container maxWidth="md">

                                                <Card style={{ padding: "10px", marginTop: "10px" }}>
                                                    <h2>Shipping</h2>
                                                    <p> <strong>Name</strong> : {order.shippingAddress.fullName} </p>
                                                    <p><strong>Address</strong> : {order.shippingAddress.address} , {order.shippingAddress.city} , {order.shippingAddress.postalCode} , {order.shippingAddress.country}</p>
                                                    {
                                                        order.isDelivered ? (
                                                            <Alert severity="success">Delivered at {order.deliveredAt}</Alert>
                                                        ) : (
                                                            <Alert severity="error">Not Delivered </Alert>
                                                        )
                                                    }
                                                </Card>
                                            </Container>
                                            <Container maxWidth="md">
                                                <Card style={{ padding: "10px", marginTop: "10px" }}>
                                                    <h2>Payment</h2>
                                                    <p> <strong>Method :</strong> {order.paymentMethod} </p>
                                                    {
                                                        order.isPaid ? (
                                                            <Alert severity="success">Paid at {order.paidAt}</Alert>
                                                        ) : (
                                                            <Alert severity="error">Not Paid </Alert>
                                                        )
                                                    }
                                                </Card>
                                            </Container>
                                            <Container maxWidth="md">
                                                <Card style={{ paddingLeft: "10px", marginTop: "10px" }}>
                                                    <h2>Items</h2>
                                                    <List>
                                                        {
                                                            order.orderItems.map(item => {
                                                                return (
                                                                    <ListItem key={item._id} style={{ margin: "5px", paddingLeft: "0px", borderRadius: "5px", boxShadow: "1px 1px rgba(0 , 0 , 0 , 0.2)" }}>
                                                                        <Grid item xs={8}>
                                                                            <List>
                                                                                <ListItem>
                                                                                    <ListItemAvatar>
                                                                                        <Avatar alt={item.name} src={'../../' + item.image} />
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
                                                                            <div style={{ color: "#000" }} >$ {item.price}</div>
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
                                                <Card style={{ paddingLeft: "10px", marginTop: "10px", marginBottom: "10px" }}>
                                                    <h2>Order Summary</h2>
                                                    <div className='space-between'>
                                                        <div><strong>Items Price </strong></div>
                                                        <div>{order.itemsPrice.toFixed(2)}</div>
                                                    </div>
                                                    <div className='space-between'>
                                                        <div><strong>Shipping Price </strong></div>
                                                        <div>{order.shippingPrice.toFixed(2)}</div>
                                                    </div>
                                                    <div className='space-between'>
                                                        <div><strong>Tax  </strong></div>
                                                        <div>{order.taxPrice.toFixed(2)}</div>
                                                    </div>
                                                    <div className='space-between'>
                                                        <div><strong>Total Price </strong></div>
                                                        <div>{order.totalPrice.toFixed(2)}</div>
                                                    </div>
                                                    <div>
                                                        {
                                                            loadingUpdate ? <CircularProgress />
                                                                : errorUpdate ? <Alert severity="error" >{errorUpdate}</Alert>
                                                                    : updated ? <Alert ><h3> Order is delivered.</h3> </Alert> : null
                                                        }
                                                        <div className='center'>
                                                            {
                                                                order.isDelivered ? null : (
                                                                    <Button type='button' variant='outlined' onClick={() => updateData()} >Deliver Order</Button>
                                                                )
                                                            }

                                                        </div>
                                                    </div>
                                                </Card>
                                            </Container>
                                        </Grid>
                                    </Grid>
                                ) : (null)}
                            </div>
                        )
            }
        </div>
    )
}
