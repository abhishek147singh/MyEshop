import React, { useContext, useEffect, useReducer } from 'react';
import { Grid, Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress, Alert, IconButton, List, ListItem, TableContainer } from '@mui/material';
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


export default function AdminUserScreen() {

    const reducer = (state, action) => {
        switch (action.type) {
            case 'FETCH_REQUEST':
                return { ...state, loading: true };
            case 'FETCH_SUCCESS':
                return { ...state, users: action.payload, loading: false };
            case 'FETCH_FAIL':
                return { ...state, loading: false, error: action.payload };
            case 'DELETE_REQUEST':
                return { ...state, deleteLoading: true };
            case 'DELETE_SUCCESS':
                return { ...state, deleteSuccess : true , deleteLoading: false };
            case 'DELETE_FAIL':
                return { ...state, deleteLoading : false, deleteSuccess : false , error: action.payload };
            default:
                return state;

        }
    }

    const { state } = useContext(Store);
    const { userInfo } = state;

    const navigate = useNavigate();
    const size = useWindowSize();

    const [{ loading, error, users , deleteLoading , deleteSuccess }, dispatch] = useReducer(reducer, { loading: false, error: '', users: [] , deleteLoading : false , deleteSuccess : false })

    const deleteUser = async (id) => {

         dispatch({type : 'DELETE_REQUEST' });
         try{
            await axios.delete(`/api/users/admin/delete/${id}` , {
                headers : { Authorization : userInfo.token }
            });
            dispatch({type : 'DELETE_SUCCESS'}); 
         }catch(err){
            dispatch({type : 'DELETE_FAIL' , payload : err});
         }
    }

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await axios.get('/api/users/admin/users', {
                    headers: { Authorization: userInfo.token }
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message });
            }
        }

        fetchData();
    }, [userInfo , deleteLoading ]);

    return (
        <div className='main'>
            <Grid container item spacing={1}>
                <Grid item md={3}>
                    <AdminSidebar />
                </Grid>
                <Grid item md={9}>
                    <div>
                        <h2> Users </h2>
                    </div>
                    {deleteLoading ? (<div className='center'> <CircularProgress /> </div>) : (deleteSuccess ) && (<Alert > Deleted successfully </Alert>) }
                    {
                        (loading ) ? (<div className='center'> <CircularProgress /> </div>)
                            : error ? (<Alert severity='error' > {error} </Alert>)
                                : (
                                    <Container component={Paper} maxWidth="md" style={{ padding: "10px", margin: "10px auto" }} >
                                        <TableContainer sx={{width : (size.width - 20) + 'px'  , maxWidth: 800 }}>
                                        <Table sx={{ minWidth: 800 }} size="small" aria-label="a dense table">
                                            <TableHead>
                                                <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <StyledTableCell>ID</StyledTableCell>
                                                    <StyledTableCell>NAME</StyledTableCell>
                                                    <StyledTableCell>EMAIL</StyledTableCell>
                                                    <StyledTableCell>ADMIN</StyledTableCell>
                                                    <StyledTableCell>ACTIONS</StyledTableCell>
                                                </StyledTableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    users.map((user) => (
                                                        <StyledTableRow key={user._id}>
                                                            <StyledTableCell>{user._id}</StyledTableCell>
                                                            <StyledTableCell>{user.name}</StyledTableCell>
                                                            <StyledTableCell>{user.email}</StyledTableCell>
                                                            <StyledTableCell>{user.isAdmin === "true" ? 'YES' : 'NO'}</StyledTableCell>
                                                            <StyledTableCell>
                                                                <List>
                                                                    <ListItem>
                                                                        <IconButton color='primary' onClick={() => { navigate(`/admin/user/${user._id}`); }}>
                                                                            <Edit />
                                                                        </IconButton>
                                                                        <IconButton color='primary' onClick={() => deleteUser(user._id)}>
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
        </div>
    )
}
