import React, { useContext, useEffect, useReducer } from 'react';
import { Grid, Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress, Alert, IconButton, List, ListItem, Button, TableContainer } from '@mui/material';
import { Container } from '@mui/system';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import AdminSidebar from '../componets/AdminSidebar';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import Edit from "@mui/icons-material/Edit";
import useWindowSize from '../componets/windowSize';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


export default function AdminProductScreen() {

    const reducer = (state, action) => {
        switch (action.type) {
            case 'FETCH_REQUEST':
                return { ...state, loading: true };
            case 'FETCH_SUCCESS':
                return { ...state, products: action.payload, loading: false };
            case 'FETCH_FAIL':
                return { ...state, loading: false, error: action.payload };
            case 'DELETE_REQUEST':
                return { ...state, deleteLoading: true };
            case 'DELETE_SUCCESS':
                return { ...state, deleteSuccess: true, deleteLoading: false };
            case 'DELETE_FAIL':
                return { ...state, deleteLoading: false, deleteSuccess: false, error: action.payload };
            default:
                return state;

        }
    }

    const { state } = useContext(Store);
    const { userInfo } = state;

    const navigate = useNavigate();
    const size = useWindowSize();

    const [{ loading, error, products, deleteLoading, deleteSuccess }, dispatch] = useReducer(reducer, { loading: false, error: '', products: [], deleteLoading: false, deleteSuccess: false })

    const deleteProduct = async (id) => {

        dispatch({ type: 'DELETE_REQUEST' });
        try {
            await axios.delete(`/api/products/admin/delete/${id}`, {
                headers: { Authorization: userInfo.token }
            });
            dispatch({ type: 'DELETE_SUCCESS' });
        } catch (err) {
            dispatch({ type: 'DELETE_FAIL', payload: err });
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await axios.get('/api/products/admin/products', {
                    headers: { Authorization: userInfo.token }
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }
        }

        fetchData();
    }, [userInfo, deleteLoading]);

    return (
        <div className='main'>
            <Grid container item spacing={1}>
                <Grid item md={3}>
                    <AdminSidebar />
                </Grid>
                <Grid item md={9}>
                    <div className='space-between'>
                        <div>
                            <h2> Products </h2>
                        </div>
                        <div>
                            <Button variant='outlined' color="inherit" onClick={() => navigate('/admin/createproduct')}>
                                CREATE PRODUCT
                            </Button>
                        </div>
                    </div>
                    {deleteLoading ? (<div className='center'> <CircularProgress /> </div>) : (deleteSuccess) && (<Alert > Deleted successfully </Alert>)}
                    {
                        (loading) ? (<div className='center'> <CircularProgress /> </div>)
                            : error ? (<Alert severity='error' > {error} </Alert>)
                                : (

                                    <Container component={Paper} maxWidth="md" style={{ padding: "10px", margin: "10px auto" }} >
                                        <TableContainer sx={{ width: (size.width - 20) + 'px', maxWidth: 870 }}>
                                        <Table sx={{ minWidth: 850 }} size="small" aria-label="a dense table">
                                            <TableHead>
                                                <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <StyledTableCell>ID</StyledTableCell>
                                                    <StyledTableCell>NAME</StyledTableCell>
                                                    <StyledTableCell>PRICE</StyledTableCell>
                                                    <StyledTableCell>CATEGORY</StyledTableCell>
                                                    <StyledTableCell>COUNT</StyledTableCell>
                                                    <StyledTableCell>RATING</StyledTableCell>
                                                    <StyledTableCell>ACTIONS</StyledTableCell>
                                                </StyledTableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    products.map((product) => (
                                                        <StyledTableRow key={product._id}>
                                                            <StyledTableCell>{product._id}</StyledTableCell>
                                                            <StyledTableCell>{product.name}</StyledTableCell>
                                                            <StyledTableCell>{product.price}</StyledTableCell>
                                                            <StyledTableCell>{product.category}</StyledTableCell>
                                                            <StyledTableCell>{product.countInStock}</StyledTableCell>
                                                            <StyledTableCell>{product.rating}</StyledTableCell>
                                                            <StyledTableCell>
                                                                <List>
                                                                    <ListItem>
                                                                        <IconButton color='primary' onClick={() => { navigate(`/admin/product/${product._id}`); }}>
                                                                            <Edit />
                                                                        </IconButton>
                                                                        <IconButton color='primary' onClick={() => deleteProduct(product._id)}>
                                                                            <DeleteIcon />
                                                                        </IconButton>
                                                                    </ListItem>
                                                                </List>
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    </Container>


                )
                    }
            </Grid>
        </Grid>
        </div >
    )
}
