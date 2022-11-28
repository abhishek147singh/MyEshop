import { Button, Card, Container, FormControl, FormGroup, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Axios from "axios";
import { Store } from "../Store";

export default function SignupScreen() {
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [conformPassword, setConformPassword] = useState('');
    const [password, setPassword] = useState('');

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        if(password !== conformPassword){
            alert("Passwords do not match");
            return;
        }

        try {
            const { data } = await Axios.post('/api/users/signup', {
                name,
                email,
                password
            });

            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || "/");

        } catch (error) {
            alert("Failed to create your account ?");
        }
    }

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo])

    return (
        <main className='main center'>
            <Container maxWidth="sm">
                <Card>
                    <h1 className='text-center'>Sign Up</h1>
                    <form onSubmit={submitHandler}>
                        <FormGroup >
                            <FormControl type="text" >
                                <TextField
                                    label="name"
                                    type="text"
                                    size='sm'
                                    style={{ margin: "10px" }}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </FormControl>
                            <FormControl type="email">
                                <TextField
                                    label="email"
                                    type="email"
                                    size='sm'
                                    style={{ margin: "10px" }}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </FormControl>
                        </FormGroup>
                        <FormGroup >
                            <FormControl type="password">
                                <TextField
                                    label="Password"
                                    type="password"
                                    autoComplete="current-password"
                                    size='sm'
                                    style={{ margin: "10px" }}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </FormControl>
                        </FormGroup>
                        <FormGroup >
                            <FormControl type="text">
                                <TextField
                                    label="Confirm Password"
                                    type="text"
                                    size='sm'
                                    style={{ margin: "10px" }}
                                    onChange={(e) => setConformPassword(e.target.value)}
                                    required
                                />
                            </FormControl>
                        </FormGroup>
                        
                        
                        <div className='center'>
                            <Button type='submit' size='large' variant="contained" color="inherit" >Sign Up</Button>
                        </div>
                        <div className='center border'>
                            <div className='center'>
                                <h3>Already have an account ?</h3>
                            </div>
                            <div className='center'>
                                <Link style={{ color: "#000" }} to={`/signin?redirect=${redirect}`}> Sign In</Link>
                            </div>
                        </div>
                    </form>
                </Card>
            </Container>
        </main>
    )
}
