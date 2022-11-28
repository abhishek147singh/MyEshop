import { Alert, Button, Card, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState, useReducer } from 'react';
import { useLocation } from "react-router-dom";
import Products from '../componets/Products';
import Rating from '../componets/Rating';
import CancelIcon from '@mui/icons-material/Cancel';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                products: action.payload.products,
                page: action.payload.page,
                pages: action.payload.pages,
                countProducts: action.payload.countProducts
            };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }

}


export default function SearchScreen() {

    const [categories, setCategories] = useState([]);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const [category, setCategory] = useState(sp.get('category') || 'all');
    const [price, setPrice] = useState(sp.get('price') || 'all');
    const [rating, setRating] = useState(sp.get('rating') || 'all');
    const [order, setOrder] = useState(sp.get('order') || 'newest');
    const [page, setPage] = useState(sp.get('page') || 1);
    const query = sp.get('query') || 'all';


    const [{ loading, error, products, pages, countProducts }, dispatch] = useReducer(reducer, { loading: true, error: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`);
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message })
            }
        }
        fetchData();
    }, [category, error, order, page, price, query, rating]);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/api/products/categories');
                setCategories(data);
            } catch (err) {
                alert("Error : " + err.message);
            }
        }
        fetchCategories();

    }, [dispatch]);

    const prices = [
        {
            name: '$1 to $50',
            value: '1-50',
        },
        {
            name: '$1 to $200',
            value: '1-200',
        },
        {
            name: '$201 to $1000',
            value: '201-1000',
        },

    ];

    const ratings = [
        {
            name: '4starts & up',
            rating: 4,
        },
        {
            name: '3starts & up',
            rating: 3,
        },
        {
            name: '2starts & up',
            rating: 2,
        },
        {
            name: '1starts & up',
            rating: 1,
        }
    ];


    return (
        <div className='main'>
            <Grid container item spacing={2}>
                <Grid item md={3} >
                    <div style={{ width: "100%", padding: "10px", display: "flex", justifyContent: "center", alignItems: "center" }} >
                        <Card sx={{ p: "10px", m: "5px", width: "220px" }}>
                            <h2 className='center'>Filter</h2>
                            <div>
                                <h3>Department</h3>
                                <FormControl fullWidth>
                                    <InputLabel id="category-select-label">Category</InputLabel>
                                    <Select
                                        id="category-select-label"
                                        onChange={(e) => setCategory(e.target.value)}
                                        label="Category"
                                        value={category}
                                    >
                                        <MenuItem value='all'>
                                            Any
                                        </MenuItem>
                                        {
                                            categories.map(c => (
                                                <MenuItem key={c} value={c}>
                                                    {c}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                            <div>
                                <h3>Price</h3>
                                <FormControl fullWidth>
                                    <InputLabel id="price-select-label">Price</InputLabel>
                                    <Select
                                        id="price-select-label"
                                        label="Price"
                                        onChange={(e) => { setPrice(e.target.value) }}
                                        value={price}
                                    >
                                        <MenuItem value='all'>
                                            Any
                                        </MenuItem>
                                        {
                                            prices.map(p => (
                                                <MenuItem key={p.name} value={p.value}>
                                                    {p.name}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                            <div>
                                <h3>Customer Reviews</h3>
                                <FormControl fullWidth>
                                    <InputLabel id="review-select-label">Reviews</InputLabel>
                                    <Select
                                        id="review-select-label"
                                        label="Reviews"
                                        onChange={(e) => { setRating(e.target.value) }}
                                        value={rating}
                                    >
                                        {
                                            ratings.map(r => (
                                                <MenuItem key={r.name} value={r.rating}>
                                                    <Rating rating={r.rating} />
                                                </MenuItem>
                                            ))
                                        }
                                        <MenuItem value='all'>
                                            <Rating rating={0} />
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </Card>
                    </div>
                </Grid>
                <Grid item md={9} >
                    {loading ? (<CircularProgress />)
                        : error ? (<Alert>{error}</Alert>) :
                            (
                                <>
                                    <Grid container item className='space-between'>
                                        <Grid item md={6}>
                                            <div>
                                                {countProducts === 0 ? 'No' : countProducts} Results
                                                {query !== 'all' && ' : ' + query}
                                                {category !== 'all' && ' : ' + category}
                                                {price !== 'all' && ' : Price ' + price}
                                                {rating !== 'all' && ' : Rating ' + rating + '& up'}
                                                {query !== 'all' || categories !== 'all' || rating !== 'all' || price !== 'all'
                                                    ? (
                                                        <Button
                                                            onClick={() => {
                                                                setPrice('all');
                                                                setCategory('all');
                                                                setRating('all');
                                                            }}
                                                        >
                                                            <CancelIcon />
                                                        </Button>
                                                    ) : null
                                                }
                                            </div>
                                        </Grid>
                                        <Grid item md={6}>

                                            <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", flexWrap: "wrap" }}>
                                                <FormControl sx={{ minWidth: 220 }}>
                                                    <InputLabel id="sort-select-label">Sort By</InputLabel>
                                                    <Select
                                                        id="sort-select-label"
                                                        label="Sort By"
                                                        value={order}
                                                        onChange={(e) => setOrder(e.target.value)}
                                                        size="small"
                                                    >
                                                        <MenuItem value="newest">Newest Arrivals</MenuItem>
                                                        <MenuItem value="lowest">Price : Low to High</MenuItem>
                                                        <MenuItem value="highest">Price : High to Low</MenuItem>
                                                        <MenuItem value="toprated">Avg. Customer Reviews</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </div>

                                        </Grid>
                                    </Grid>

                                    <Grid item>
                                        <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", flexWrap: "wrap" }}>
                                            {
                                                products.length === 0 && (<Alert> No Product found </Alert>)
                                            }
                                            {
                                                products.map(product => (
                                                    <Products key={product._id} product={product} />
                                                ))
                                            }
                                        </div>
                                    </Grid>
                                    <div className='center'>
                                        {
                                            [...Array(pages).keys()].map(x => (
                                                <Button 
                                                    key={x}
                                                    value={x + 1}
                                                    className={Number(page) === x + 1 ? 'text-bold' : ''}
                                                    variant={Number(page) === x + 1 ? "contained" : "outlined"}
                                                    onClick={(e) => setPage(e.target.value)}
                                                >
                                                    {x + 1}
                                                </Button>
                                            ))
                                        }
                                    </div>
                                </>
                            )}
                </Grid>
            </Grid>
        </div>
    )
}
