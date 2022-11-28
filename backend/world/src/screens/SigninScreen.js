import {  Button, Card, Container, FormControl, FormGroup, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Axios from "axios";
import { Store } from "../Store";

export default function SigninScreen() {
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { state , dispatch : ctxDispatch } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await Axios.post('/api/users/signin', {
                email,
                password
            });
            ctxDispatch({type : 'USER_SIGNIN' , payload : data });
            localStorage.setItem('userInfo' , JSON.stringify(data));
            navigate(redirect || "/");
        } catch (error) {
            alert("Invalid email and password");
        }
    }
    
    useEffect(() => {
         if(userInfo){
            navigate(redirect);
         }
    } , [navigate , redirect , userInfo])

    return (
        <main className='main center'>
            <Container maxWidth="sm">

                <Card>
                    <h1 className='text-center'>Sign In</h1>
                    <form onSubmit={submitHandler}>
                        <FormGroup >

                            <FormControl type="email" required>
                                <TextField
                                    id="outlined-password-input"
                                    label="email"
                                    type="email"
                                    size='sm'
                                    style={{ margin: "10px" }}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormControl>
                        </FormGroup>
                        <FormGroup >
                            <FormControl type="password" required>
                                <TextField
                                    id="outlined-password-input"
                                    label="Password"
                                    type="password"
                                    autoComplete="current-password"
                                    size='sm'
                                    style={{ margin: "10px" }}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </FormControl>
                        </FormGroup>
                        <div className='center'>
                            <Button type='submit' size='large' variant="contained" color="inherit" >Sign In</Button>
                        </div>
                        <div className='center border'>
                            <div className='center'>
                                <h3>New Customer ?</h3>
                            </div>
                            <div className='center'>
                                <Link style={{ color: "#000" }} to={`/signup?redirect=${redirect}`}> Create your Account</Link>
                            </div>
                        </div>
                    </form>
                </Card>
            </Container>
        </main>
    )
}
