import { Alert, Button, Card, CircularProgress, Container, FormGroup, Grid, TextField } from '@mui/material'
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
  

export default function EditProductScreen() {

    const params = useParams();
    const { id } = params;

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [imageSrc ,setImageSrc] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [discription, setDiscription] = useState('');
    const [countInStock, setCountInStock] = useState(0);   
    
    const { state } = useContext(Store);
    const { userInfo } = state;
    
    const [{ loading, error, updateLoading , updateError , updateResult }, dispatch] = useReducer(reducer, { loading: true, error: "" , product: {} , updateLoading : false , updateError : '' , updateResult : {} });
  
    const submitHandler = (e) => {
      e.preventDefault();
      const saveData = async () => {
          dispatch({ type: 'UPDATE_REQUEST' });
          try {
              const { data } = await axios.put(`/api/products/admin/update/${id}`, {
                  name,
                  price,
                  imageSrc,
                  category,
                  brand,
                  discription,
                  countInStock,
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
          const { data } = await axios.get(`/api/products/${id}`);
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
          setName(data.name);
          setBrand(data.brand)
          setCategory(data.category);
          setImageSrc(data.imageSrc);
          setPrice(data.price)
          setDiscription(data.discreption)

        } catch (error) {
          dispatch({ type: 'FETCH_FAIL', payload: error.message });
        }
      }
      fetch();

    }, [id]);
  
    

    return (
        <div className='main'>
            <Grid container item spacing={1}>
                <Grid item md={3}>
                    <AdminSidebar />
                </Grid>
                <Grid item md={9}>
                    <h2>Edit Product</h2>
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
                                        <TextField
                                            label="Price"
                                            type="number"
                                            size='small'
                                            style={{ margin: "10px" }}
                                            onChange={(e) => setPrice(e.target.value)}
                                            value={price}
                                            required
                                        />
                                        <TextField
                                            label="Image Path"
                                            type="text"
                                            size='small'
                                            style={{ margin: "10px" }}
                                            onChange={(e) => setImageSrc(e.target.value)}
                                            value={imageSrc}
                                            required
                                        />
                                        
                                        <TextField
                                            label="Category"
                                            type="text"
                                            size='small'
                                            style={{ margin: "10px" }}
                                            onChange={(e) => setCategory(e.target.value)}
                                            value={category}
                                            required
                                        />
                                        <TextField
                                            label="Brand"
                                            type="text"
                                            size='small'
                                            style={{ margin: "10px" }}
                                            onChange={(e) => setBrand(e.target.value)}
                                            value={brand}  
                                            required
                                        />
                                        <TextField
                                            label="Coun In Stock"
                                            type="number"
                                            size='small'
                                            style={{ margin: "10px" }}
                                            onChange={(e) => setCountInStock(e.target.value)}
                                            value={countInStock}
                                            required
                                        />
                                        <TextField
                                            label="Description"
                                            type="text"
                                            size='small'
                                            style={{ margin: "10px" }}
                                            onChange={(e) => setDiscription(e.target.value)}
                                            value={discription}
                                            required
                                        />
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
