import React, { useContext, useEffect, useReducer } from 'react';
import { Grid, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button , CircularProgress , Alert , TableContainer } from '@mui/material';
import { Container } from '@mui/system';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import AdminSidebar from '../componets/AdminSidebar';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

export default function AdminOrderScreen() {

    const reducer = (state, action) => {
        switch (action.type) {
            case 'FETCH_REQUEST':
                return { ...state, loading: true };
            case 'FETCH_SUCCESS':
                return { ...state, orders: action.payload, loading: false };
            case 'FETCH_FAIL':
                return { ...state, loading: false, error: action.payload };
            default:
                return state;

        }
    }

    const { state } = useContext(Store);
    const { userInfo } = state;

    const navigate = useNavigate();
    const size = useWindowSize();

    const [{ loading, error, orders }, dispatch] = useReducer(reducer, { loading: false, error: '', orders: [] })

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await axios.get('/api/orders/admin/orders', {
                    headers: { Authorization: userInfo.token }
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }
        }

        fetchData();
    }, [userInfo]);
    return (
        <div className='main'>
            <Grid container item spacing={1}>
                <Grid item md={3}>
                    <AdminSidebar />
                </Grid>
                <Grid item md={9}>
                    {
                        (loading) ? (<div className='center'> <CircularProgress /> </div>)
                            : error ? (<Alert> {error} </Alert>)
                                : (
                                    <Container component={Paper} maxWidth="md" style={{ padding: "10px", margin: "10px auto" }} >
                                       <TableContainer sx={{width : (size.width - 20) + 'px'  , maxWidth: 800 }}>
                                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                            <TableHead>
                                                <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <StyledTableCell>ID</StyledTableCell>
                                                    <StyledTableCell>DATE</StyledTableCell>
                                                    <StyledTableCell>TOTAL</StyledTableCell>
                                                    <StyledTableCell>PAID</StyledTableCell>
                                                    <StyledTableCell>DELIVERED</StyledTableCell>
                                                    <StyledTableCell>ACTIONS</StyledTableCell>
                                                </StyledTableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    orders.map((order) => (
                                                        <StyledTableRow key={order._id}>
                                                            <StyledTableCell>{order._id}</StyledTableCell>
                                                            <StyledTableCell>{order.createdAt.substring(0, 10)}</StyledTableCell>
                                                            <StyledTableCell>{order.totalPrice.toFixed(2)}</StyledTableCell>
                                                            <StyledTableCell>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</StyledTableCell>
                                                            <StyledTableCell>{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}</StyledTableCell>
                                                            <StyledTableCell><Button type='button' variant='outlined' onClick={() => navigate(`/admin/order/${order._id}`)}>Details</Button></StyledTableCell>
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
        </div>
    )
}
