import React, { useReducer } from 'react';
import { useEffect } from "react";
import axios from "axios";
import Products from '../componets/Products';
import { Alert, CircularProgress } from '@mui/material';

const reducer = (state , action) => {
    switch(action.type){
        case 'FETCH_REQUEST':
            return {...state , loading:true};

        case 'FETCH_SUCCESS':
            return {...state , products: action.payload , loading : false};

        case 'FETCH_FAIL':
            return {...state , loading:false , error : action.payload};

        default:
            return state;
    }
}

export default function HomeScreen() {
    const [{loading ,error , products } , dispatch] = useReducer(reducer , {loading:true , error : ""  , products : []});

    useEffect(() => {
        const fetch = async () => {
            dispatch({type:'FETCH_REQUEST'})
            try {
                const getData = await axios.get("/api/products");   
                dispatch({type:'FETCH_SUCCESS' , payload: getData.data })
            } catch (error) {
                dispatch({type:'FETCH_FAIL' , payload:error.message});
            }
        }
        fetch();
    }, []);

    return (
        <div>
            <main className='main'>
                <h1 style={{ marginLeft: "10px" }}>Products freatures</h1>
                {
                    loading ? (<div className='center'> <CircularProgress /> </div>) 
                    : error ? (<Alert> { error }</Alert>)
                    : (
                        <div className='products'>
                        {
                            products.map(product =>
                                <Products key = {product._id }  product = { product }  />
                            )
                        }
                        </div>
                    )
                }
            </main>
        </div>
    )
}
