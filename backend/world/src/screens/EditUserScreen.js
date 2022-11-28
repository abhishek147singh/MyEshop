import { Alert, Button, Card, Checkbox, CircularProgress, Container, FormControl, FormControlLabel, FormGroup, Grid, TextField } from '@mui/material'
import axios from 'axios';
import React, {  useContext, useEffect, useReducer, useState } from 'react'
import {  useParams } from 'react-router-dom';
import AdminSidebar from '../componets/AdminSidebar';
import { Store } from '../Store';


const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
  
      case 'FETCH_SUCCESS':
        return { ...state, product: action.payload, loading: false };
  
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };

      case 'UPDATE_REQUEST':
        return { ...state, updateLoading : true };
    
      case 'UPDATE_SUCCESS':
        return { ...state, updateResult : action.payload, updateLoading : false };
    
      case 'UPDATE_FAIL':
        return { ...state, updateLoading : false, updateError : action.payload };
  
      default:
        return state;
    }
  }
  

export default function EditUserScreen() {

    const params = useParams();
    const { id } = params;

    const [name, setName] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
     
    const { state } = useContext(Store);
    const { userInfo } = state;
    
    const [{ loading, error, updateLoading , updateError , updateResult }, dispatch] = useReducer(reducer, { loading: true, error: "" , product: {} , updateLoading : false , updateError : '' , updateResult : {} });
  
    const submitHandler = (e) => {
      e.preventDefault();
      const saveData = async () => {
          dispatch({ type: 'UPDATE_REQUEST' });
          try {
              const { data } = await axios.put(`/api/users/admin/update/${id}`, {
                  id,
                  name,
                  isAdmin
              }, {
                  headers: { Authorization: userInfo.token }
              });
              dispatch({ type: 'UPDATE_SUCCESS', payload: data });
          } catch (err) {
              console.log(err);
              dispatch({ type: 'UPDATE_FAIL', payload: err.message });
          }
      }
      saveData();
  }


    useEffect(() => {
  
      const fetch = async () => {
        dispatch({ type: 'FETCH_REQUEST' })
        try {
          const { data } = await axios.get(`/api/users/${id}` , {
             headers : { Authorization : userInfo.token }
          });
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
          setName(data.name);
          setIsAdmin(data.isAdmin === "true");
        } catch (error) {
          dispatch({ type: 'FETCH_FAIL', payload: error.message });
        }
      }
      fetch();

    }, [id , userInfo ]);
  
    

    return (
        <div className='main'>
            <Grid container item spacing={1}>
                <Grid item md={3}>
                    <AdminSidebar />
                </Grid>
                <Grid item md={9}>
                    <h2>Edit User </h2>
                    <Container maxWidth="sm">
                        <Card>
                            {
                                loading ? <CircularProgress/> 
                                : error ? <Alert severity="error" >{error}</Alert>
                                : null
                            }
                            {
                                updateLoading ? <CircularProgress/> 
                                : updateError ? <Alert severity="error" >{ updateError }</Alert>
                                : updateResult._id !== undefined ? <Alert >Your data is udated successfully .</Alert> : null
                            }
                            <form onSubmit={submitHandler}>
                                <FormGroup >
                                        <TextField
                                            label="Name"
                                            type="text"
                                            size='small'
                                            style={{ margin: "10px" }}
                                            onChange={(e) => setName(e.target.value)}
                                            value={name}
                                            required
                                        />
                                        <FormControl>
                                            <FormControlLabel sx={{ml:"5px"}} control={ <Checkbox checked={isAdmin} onChange={(e) => setIsAdmin( Boolean(e.target.checked)) } inputProps={{ 'aria-label': 'controlled' }} />} label="Admin" />
                                        </FormControl>
                                </FormGroup>
                               
                                <div className='center'>
                                  {updateLoading ? 
                                    (<Button disabled type='submit' size='large' variant="contained" color="inherit" >Update</Button>):
                                    (<Button type='submit' size='large' variant="contained" color="inherit" >Update</Button>)}
                                    
                                </div>
                            </form>
                        </Card>
                    </Container>
                </Grid>
            </Grid>
        </div>
    )
}
