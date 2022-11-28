import { Card, CardActionArea, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import React, { useContext, useEffect, useReducer, useState } from 'react'
import AdminSidebar from '../componets/AdminSidebar';
import { Store } from "../Store";
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

function reducer(state, action) {
  switch (action.type) {
      case 'FETCH_REQUEST':
          return { ...state, loading: true, error: '' };
      case 'FETCH_SUCCESS':
          return { ...state, loading: false, data: action.payload, error: '' };
      case 'FETCH_FAIL':
          return { ...state, loading: false, error: action.payload };

      default:
          return state;
  }
}

export default function DeshboardScreen() {

  const [{ loading, error, data }, dispatch] = useReducer(reducer, { loading: false, error: "", data: {} });
  const [totalAmount , setTotalAmount] = useState(0);
  const [totalOrders , setTotalOrders] = useState(0);
  const [totalUsers , setTotalUsers ] = useState(0);
  const [totalProducts , setTotalProduts] = useState(0);

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {

    const fetchData = async () => {
        dispatch({ type: 'FETCH_REQUEST' });
        try {
            const result = await axios.get(`/api/orders/admin/orders/graphData`, {
                headers: { authorization: userInfo.token }
            });
            //console.log(result.data);
            let totalAmt = 0 , totalOr = 0;
            result.data.graphData .forEach(e => {
              totalAmt += e.totalAmt;
              totalOr  += e.count;
            });

            setTotalAmount(totalAmt);
            setTotalOrders(totalOr);
            setTotalUsers(result.data.users);
            setTotalProduts(result.data.products);

            dispatch({ type: 'FETCH_SUCCESS', payload: result.data.graphData });
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
          <Grid container item spacing={2} sx={{ mt: "10px" }}>
            <Grid item md={3} sm={6} xs={12}>
              <Card sx={{ p: "10px" }} >
                <CardActionArea>
                  <h2>${totalAmount}</h2>
                  <p>Sales</p>
                  <Link style={{ color: "#000", fontWeight: "500", fontSize: "18", padding: "5px", marginTop: "8px", marginBottom: "8px", textTransform: "uppercase" }} to="/admin/dashboard">
                    View sales
                  </Link>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Card sx={{ p: "10px" }} >
                <CardActionArea>
                  <h2>{totalOrders}</h2>
                  <p>Orders</p>
                  <Link style={{ color: "#000", fontWeight: "500", fontSize: "18", padding: "5px", marginTop: "8px", marginBottom: "8px", textTransform: "uppercase" }} to="/admin/orders">
                    View orders
                  </Link>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Card sx={{ p: "10px" }} >
                <CardActionArea>
                  <h2>{totalProducts}</h2>
                  <p>Products</p>
                  <Link style={{ color: "#000", fontWeight: "500", fontSize: "18", padding: "5px", marginTop: "8px", marginBottom: "8px", textTransform: "uppercase" }} to="/admin/products">
                    View products
                  </Link>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Card sx={{ p: "10px" }} >
                <CardActionArea>
                  <h2>{totalUsers}</h2>
                  <p>Users</p>
                  <Link style={{ color: "#000", fontWeight: "500", fontSize: "18", padding: "5px", marginTop: "8px", marginBottom: "8px", textTransform: "uppercase" }} to="/admin/users">
                    View users
                  </Link>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
          <Grid item >
              <h3>Sales Report</h3>
              <ResponsiveContainer width="100%" aspect={3} >
                <LineChart data={data} width={500} height={300} margin={{ top: 5, right: 300, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" interval={'preserveStartEnd'} />
                  <YAxis />
                  <Tooltip  />
                  <Legend />
          
                  <Line type="monotone" dataKey="totalAmt" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}
