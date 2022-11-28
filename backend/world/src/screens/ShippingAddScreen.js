import React , { useContext, useEffect, useState } from 'react'
import { Button, Card, Container, FormControl, TextField, FormGroup } from '@mui/material';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../componets/CheckoutSteps';

export default function ShippingAddScreen() {


    const { state , dispatch:ctxDispatch} = useContext(Store);
    const { cart : { shippingAddress } , userInfo } = state; 

    const navigate = useNavigate();

    const [fullName, setFullName] = useState( shippingAddress.fullName || '');
    const [address, setAddress] = useState( shippingAddress.address || '');
    const [city, setCity] = useState( shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState( shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');

    useEffect(() => {
        if(!userInfo){
            navigate('/signin');
        }
    } , [userInfo , navigate]);

    function sumitHandler(e) {
        e.preventDefault();
        ctxDispatch({
            type : 'SAVE_SHIPPING_ADDRESS',
            payload:{
                fullName,
                address,
                city,
                postalCode,
                country
            }
        });
       navigate("/payment"); 
    }

    return (
        <main className='main center'>
            <div className="center2">
            <CheckoutSteps step1  step2 />
            <Container maxWidth="sm">
                <Card>
                    <h1 className='text-center'>Shipping Address</h1>
                    <form onSubmit={sumitHandler}>
                        <FormGroup >
                            <FormControl type="text">
                                <TextField
                                    label="Full Name"
                                    type="text"
                                    size='sm'
                                    style={{ margin: "10px" }}
                                    onChange={(e) => setFullName(e.target.value)}
                                    value = {fullName}
                                    required
                                />
                            </FormControl>
                        </FormGroup>
                        <FormGroup >
                            <FormControl type="text">
                                <TextField
                                    label="Address"
                                    type="text"
                                    size='sm'
                                    style={{ margin: "10px" }}
                                    onChange={(e) => setAddress(e.target.value)}
                                    value = {address}
                                    required
                                />
                            </FormControl>
                        </FormGroup>
                        <FormGroup >
                            <FormControl type="text">
                                <TextField
                                    label="City"
                                    type="text"
                                    size='sm'
                                    style={{ margin: "10px" }}
                                    onChange={(e) => setCity(e.target.value)}
                                    value = {city}
                                    required
                                />
                            </FormControl>
                        </FormGroup>
                        <FormGroup >
                            <FormControl type="text">
                                <TextField
                                    label="Postal Code"
                                    type="text"
                                    size='sm'
                                    style={{ margin: "10px" }}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    value = {postalCode}
                                    required
                                />
                            </FormControl>
                        </FormGroup>
                        <FormGroup >
                            <FormControl type="text">
                                <TextField
                                    label="Country"
                                    type="text"
                                    size='sm'
                                    style={{ margin: "10px" }}
                                    onChange={(e) => setCountry(e.target.value)}
                                    value = {country}
                                    required
                                />
                            </FormControl>
                        </FormGroup>
                        <div className='center'>
                            <Button type='submit' size='large' variant="contained" color="inherit" >Countinue</Button>
                        </div>
                    </form>
                </Card>
            </Container>
            </div>
        </main>
    )
}
