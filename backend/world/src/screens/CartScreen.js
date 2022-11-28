import { Grid, Alert, List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Card, CardContent, Button, Select, MenuItem } from '@mui/material'
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

export default function CartScreen() {
  const { state , dispatch:ctxDispatch } = useContext(Store);
  const { cart: { cartItems } } = state;
  const navigate = useNavigate();

  const updateCartHandler = async (item , quantity ) => {
      const { data } = await axios.get(`/api/products/${item._id}`);
   
      if(data.countInStock < quantity){
          window.alert("Sorry , Product is out of stock !!");
      }else{
          ctxDispatch({type : 'CART_ADD_ITEM' , payload : {...item , quantity }});  
      }
  }

  const removeItemHandler = async (item) => {
      ctxDispatch({type : 'CART_REMOVE_ITEM' , payload : item });  
  }

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  }

  return (
    <main className='main'>
      <Grid item container spacing={2} >
        <Grid item md={8}>
          {
            cartItems.length === 0 ? (<Alert severity="info">Cart is empty. <Link to="/" >Go Shopping</Link></Alert>)
              : (
                <List >
                  {
                    cartItems.map(item => {
                      return (
                        <ListItem key={item._id} style={{ margin:"5px" , paddingLeft:"0px" , borderRadius : "5px" , boxShadow:"1px 1px rgba(0 , 0 , 0 , 0.2)"}}>
                          <Grid item xs={6}>
                            <List>
                              <ListItem>
                                <ListItemAvatar>
                                  <Avatar alt={item.name} src={item.imageSrc} />
                                </ListItemAvatar>
                                <ListItemText >
                                  <Link style={{ color: "#000" }} to={`/products/${item._id}`}>{item.name}</Link>
                                </ListItemText>
                              </ListItem>
                            </List>
                          </Grid>
                          <Grid item xs={2} >
                            <Select 
                              value={item.quantity}
                              onChange = {(e) => {updateCartHandler(item , e.target.value )}} 
                              >
                                <MenuItem disabled = {1 > item.countInStock } value={1}>1</MenuItem>
                                <MenuItem disabled = {2 > item.countInStock } value={2}>2</MenuItem>
                                <MenuItem disabled = {3 > item.countInStock } value={3}>3</MenuItem>
                                <MenuItem disabled = {4 > item.countInStock } value={4}>4</MenuItem>
                                <MenuItem disabled = {5 > item.countInStock } value={5}>5</MenuItem>
                                <MenuItem disabled = {6 > item.countInStock } value={6}>6</MenuItem>
                                <MenuItem disabled = {7 > item.countInStock } value={7}>7</MenuItem>
                                <MenuItem disabled = {8 > item.countInStock } value={8}>8</MenuItem>
                                <MenuItem disabled = {9 > item.countInStock } value={9}>9</MenuItem>
                                <MenuItem disabled = {10 > item.countInStock } value={10}>10</MenuItem>
                            </Select>
                          </Grid>
                          <Grid item xs={4}>
                            <List>
                              <ListItem>
                                <ListItemText >
                                  <div style={{ color: "#000" }} to={`/products/${item._id}`}>$ {item.price}</div>
                                </ListItemText>
                                <IconButton onClick={() => removeItemHandler(item)} edge="end" aria-label="delete">
                                  <DeleteIcon />
                                </IconButton>
                              </ListItem>
                            </List>
                          </Grid>
                        </ListItem>

                      );
                    })
                  }
                </List>
              )
          }
        </Grid>
        <Grid item md={4}>
          <div className='center'>
            <Card style={{ width: "100%" }}>
              <CardContent>
                  <List>
                    <ListItem>
                      <h3>
                        Subtotal({cartItems.reduce((a , c) => a + c.quantity , 0)}items) 
                        : $ {cartItems.reduce((a , c) => a + c.price * c.quantity , 0)} 
                      </h3>
                    </ListItem>
                    <ListItem>
                      <div className='d-grid'>
                           <Button 
                            type='button'
                            variant="outlined"
                            color="inherit"
                            disabled = {cartItems.length === 0} 
                            onClick = {() => checkoutHandler()}  
                              >
                              Proceed to Checkout
                           </Button>
                      </div>
                    </ListItem>
                  </List>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Grid>
    </main>
  )
}
