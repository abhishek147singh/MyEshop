import { Button, Card, Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../componets/CheckoutSteps';
import { Store } from '../Store';

export default function PaymentScreen() {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart: { shippingAddress, paymentMethod } } = state;
    const navigate = useNavigate();
    const [paymentMethodName, setPaymentMethod] = useState(paymentMethod || 'PayPal');

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate("/shipping");
        }
    }, [shippingAddress, navigate]);

    function submitHandler(e) {
        e.preventDefault();
        ctxDispatch({ type:'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
        navigate("/placeorder");
    }

    return (
        <div className='main '>
            <div className='center2'>
                <CheckoutSteps step1 step2 step3 />
            </div>
            <Container maxWidth="sm">
                <Card>
                    <h1 className='text-center'>Payment Method</h1>
                    <form onSubmit={submitHandler}>
                        <div style={{ padding: "20px" }}>
                            <FormControl >
                                <FormLabel id="demo-radio-buttons-group-label">Payment Methods</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="female"
                                    name="radio-buttons-group"
                                    onChange={(e) => setPaymentMethod(e.target.value) }
                                    value={paymentMethodName}
                                    required
                                >
                                    <FormControlLabel value="PayPal" control={<Radio />} label="PayPal" />
                                    <FormControlLabel value="Stripe" control={<Radio />} label="Stripe" />
                                </RadioGroup>
                            </FormControl>
                            <div className='center'>
                                <Button type='submit' size='large' variant="contained" color="inherit" >Countinue</Button>
                            </div>
                        </div>
                    </form>
                </Card>
            </Container>
        </div>
    )
}
