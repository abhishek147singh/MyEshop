import { Alert, Button, Card, CircularProgress, TextField, FormGroup } from '@mui/material';
import { Container } from '@mui/system';
import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, userDetails: action.payload };
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


export default function ProfileScreen() {

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [{ loading, error }, dispatch] = useReducer(reducer, { loading: false, error: '', userDetails: {} });
  const [{ loadingUpdate, errorUpdate, updated }, dispatchUpdate] = useReducer(updateReducer, { loadingUpdate: false, errorUpdate: '', updated: false });

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Password and confirm password are not matched.');
    } else {
      const updateData = async () => {
        try {
          dispatchUpdate({ type: 'FETCH_REQUEST' })
          const { data } = await axios.put(`/api/users/profile`, {
            _id: userInfo._id,
            name,
            email,
            password
          }, {
            headers: { Authorization: userInfo.token }
          });

          dispatchUpdate({ type: 'FETCH_SUCCESS' });
          ctxDispatch({ type: 'USER_SIGNIN', payload: data });
          localStorage.setItem('userInfo', JSON.stringify(data));

        } catch (err) {
          dispatchUpdate({ type: 'FETCH_FAIL', payload: err.message });
        }
      }
      updateData();
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/users/${userInfo._id}`, {
          headers: { Authorization: userInfo.token }
        });
        setName(data.name);
        setEmail(data.email);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        setName(userInfo.name);
        setEmail(userInfo.email);
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    }
    fetchData();
  }, [userInfo]);

  return (
    <div className='main'>
      <Container maxWidth="sm" sx={{ marginTop: "10px" }} >

        <Card sx={{ p: "10px", display: "flex", flexDirection: "column", justifyContent: "center", alignItem: "center" }}>
          <div>
            <h1>User Profile</h1>
          </div>
          <form onSubmit={submitHandler}>

            {
              loading ? <CircularProgress />
                : error ? <Alert severity="error" >{error}</Alert>
                  : (

                    <div className='center2'>
                      <div>
                        {
                          loadingUpdate ? <CircularProgress />
                            : errorUpdate ? <Alert variant='danger'>{errorUpdate}</Alert>
                              : updated ? <Alert ><h3> Your data is updated.</h3> </Alert> : null
                        }
                      </div>
                      <Container maxWidth="sm">
                      
                      <FormGroup >
                        
                        <TextField
                          label="Name"
                          type="text"
                          style={{ margin: "10px" }}
                          onChange={(e) => setName(e.target.value)}
                          value={name}
                        />

                        <TextField
                          label="Email"
                          type="email"
                          style={{ margin: "10px" }}
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                        />

                        <TextField
                          label="Password"
                          type="password"
                          style={{ margin: "10px" }}
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                        />

                        <TextField
                          label="Confirm password"
                          type="text"
                          style={{ margin: "10px" }}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          value={confirmPassword}
                        />

                      </FormGroup>
                      
                        
                       </Container>
                      <div className='center'>
                        <Button type='submit' sx={{mt:"10px"}} variant='outlined'>Update</Button>
                      </div>
                    </div>
                  )
            }
          </form>
        </Card>
      </Container>
    </div>
  )
}
