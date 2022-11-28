import React, { useContext, useEffect, useReducer } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Store } from "../Store";
import axios from 'axios';
import { Alert, Avatar, Card, CircularProgress, Container, Grid, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload , error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'PAY_REQUEST':
            return {...state , loadingPay : true };
        case 'PAY_SUCCESS':
            return {...state , loadingPay : false , successPay : true}
        case 'PAY_FAIL':
            return {...state , loadingPay: false };
        case 'PAY_RESET':
            return {...state , loadingPay : false , successPay : false };
        default:
            return state;
    }
}

export default function OrderScreen() {

    const [{ loading, error, order , successPay , loadingPay }, dispatch] = useReducer(reducer, { loading: false, error: "", order: {} , successPay : false , loadingPay : false });
    const { state } = useContext(Store);
    const { userInfo } = state;

    const navigate = useNavigate();

    const params = useParams();
    const { id: orderId } = params;

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [
                {
                    amount: { value: order.totalPrice },
                }
            ],
        }).then((orderID) => {
            return orderID;
        });
    }

    function onApprove(data, actions) {
        return actions.order.capture().then( async function(details){
            try{
                dispatch({type : 'PAY_REQUEST'});
                const { data } = await axios.put(`/api/orders/${order._id}/pay`, details , {
                    headers : { authorization : userInfo.token }
                });
                dispatch({type : 'PAY_SUCCESS' , payload : data });
                <Alert variant='success'>Order is paid</Alert>
            }catch(err){
                dispatch({type : 'PAY_FAIL' , payload : err.message});
                alert("Error :" , err.message );
            }
        })
    }

    function onError(err){
        alert("Error :" , err.message);
    }

    useEffect(() => {
        const fetchOrder = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await axios.get(`/api/orders/${orderId}`, {
                    headers: { authorization: userInfo.token }
                });
                
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }
        }

        if (!userInfo) {
            navigate('/login');
        }
        if (!order._id || successPay || (order._id && order._id !== orderId)) {
            fetchOrder();
            if(successPay){
                dispatch({type : 'PAY_RESET'});
            }
        } else {
            const loadPaypalScript = async () => {
                const { data: clientId } = await axios.get('/api/keys/paypal', {
                    headers: { authorization: userInfo.token }
                })
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': clientId,
                        currency: 'USD'
                    }
                })
                paypalDispatch({
                    type: 'setLoadingStatus',
                    value: 'pending'
                })
            }
            loadPaypalScript();
        }
    }, [ successPay , userInfo, navigate, order, orderId, paypalDispatch]);

    return (
        <div className='main'>
            {
                (loading) ? (<div className='center'> <CircularProgress /> </div>)
                    : error ? (<Alert> {error} </Alert>)
                        : (
                            <div>
                                <h2 style={{ marginLeft: "1rem" }}> Order : {orderId} </h2>
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
                                                                                        <Avatar alt={item.name} src={'../' + item.image} />
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

                                                    {
                                                        !order.isPaid && (
                                                            <div className=' center2'>
                                                                {isPending ? (<CircularProgress />)
                                                                    : (
                                                                        <div>
                                                                            <PayPalButtons
                                                                                createOrder={createOrder}
                                                                                onApprove={onApprove}
                                                                                onError={onError}
                                                                            >

                                                                            </PayPalButtons>
                                                                            {loadingPay && <CircularProgress /> }
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        )
                                                    }


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
