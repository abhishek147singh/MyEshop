import { Alert, Button, Card, CircularProgress, Container, FormGroup, Grid, TextField } from '@mui/material'
import axios from 'axios';
import React, { useContext, useReducer, useState } from 'react'
import AdminSidebar from '../componets/AdminSidebar';
import { Store } from '../Store';

const reducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_REQUEST':
            return { ...state, loading: true };

        case 'CREATE_SUCCESS':
            return { ...state, product: action.payload, loading: false };

        case 'CREATE_FAIL':
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
}

export default function CreateProductScreen() {

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [discription, setDiscription] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [image , setImage] = useState({});

    const { state } = useContext(Store);
    const { userInfo } = state;


    const [{ loading, error, product }, dispatch] = useReducer(reducer, { loading: false , error: "", product: {} });

    const submitHandler = (e) => {
        e.preventDefault();
        const saveData = async () => {
            dispatch({ type: 'CREATE_REQUEST' });
            try {
                let formData = new FormData();
                formData.append('image', image);
                formData.append('name', name);
                formData.append('price', price);
                formData.append('category', category);
                formData.append('brand', brand);
                formData.append('discription', discription);
                formData.append('countInStock', countInStock);
                
                const { data } = await axios.post(
                    "/api/products/admin/create",
                      formData,
                      {
                          headers: {
                                Authorization: userInfo.token,
                              "Content-type": "multipart/form-data",
                          },                 
                      }
                  )
                  .then(res => {
                      console.log(`Success`);
                  })
                  .catch(err => {
                      console.log(err);
                  })

                dispatch({ type: 'CREATE_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'CREATE_FAIL', payload: err.message });
            }
        }
        saveData();
    }

    return (
        <div className='main'>
            <Grid container item spacing={1}>
                <Grid item md={3}>
                    <AdminSidebar />
                </Grid>
                <Grid item md={9}>
                    <h2>Create Product</h2>
                    <Container maxWidth="sm">
                        <Card>
                            {
                                loading ? <CircularProgress/> 
                                : error ? <Alert severity="error" >{error}</Alert>
                                : product._id !== undefined ? (<Alert>Your product is created. Product id is {product._id}</Alert> ) : null
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
                                    <input type="file" name="image" onChange={(e) => setImage(e.target.files[0])}/>
                                </FormGroup>

                                <div className='center'>
                                    <Button type='submit' size='large' variant="contained" color="inherit" >Create</Button>
                                </div>
                            </form>
                        </Card>
                    </Container>
                </Grid>
            </Grid>
        </div>
    )
}
