import { Badge, Button, IconButton, Menu, MenuItem, ToggleButton } from '@mui/material'
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { Store } from '../Store';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import SearchBar from './SearchBar';
import useWindowSize from "./windowSize";

export default function Header(props) {

  const size = useWindowSize();

  const { state } = useContext(Store);
  const { cart, userInfo } = state;

  const [anchor, setAnchor] = useState(null);
  const [anchor2, setAnchor2] = useState(null);
  const open = Boolean(anchor);
  const open2 = Boolean(anchor2);
  const [selected, setSelected] = useState(false);

  const { dispatch: ctxDispatch } = useContext(Store);

  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const signoutHandler = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    ctxDispatch({ type: 'USER_SIGNOUT' });
  }


  return (
    <>
      <header className="App-header">
        <div style={{ marginLeft: "0px", display: "flex", justifyContent: "space-between", width: "100px", alignItems: "center" }}>
          < props.sideBarIcon />
          <Link to="/">
            <div className="logo"> MyShop</div>
          </Link>
        </div>
        <div>
          {size.width < 600 ? (
            <ToggleButton
              value="check"
              selected={selected}
              onChange={() => {
                setSelected(!selected);
              }}
            >
              <SearchIcon color="primary" />
            </ToggleButton>
          ) : (<SearchBar selected={true} />)}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", width: "160px", alignItems: "center" }}>
          <div>
            <Link to="/cart" className="nav-link">
              {
                cart.cartItems.length > 0 && (
                  <Badge badgeContent={cart.cartItems.length} color="error" >
                    <IconButton color="primary" sx={{p:"1px"}}>
                      <ShoppingCart />
                    </IconButton>  
                  </Badge>
                )
              }
            </Link>
          </div>
          <div >
            {
              userInfo ? (
                <div>
                  <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    sx={{ pl: "5px", pr: "1px", ml: "3px" }}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchor}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem onClick={handleClose}><Link to="/profile" style={{ color: "black" }} >Profile</Link></MenuItem>
                    <MenuItem onClick={handleClose}><Link to="/orderhistory" style={{ color: "black" }} >Order History</Link></MenuItem>
                    <MenuItem onClick={handleClose}><Button onClick={() => signoutHandler()}> Logout</Button></MenuItem>
                  </Menu>
                </div>
              )
                : (<Link to="/signin">Sign In</Link>)
            }
          </div>
          {(userInfo && userInfo.isAdmin === "true") && (
            <div>
              <Button
                aria-controls={open2 ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open2 ? 'true' : undefined}
                onClick={(e) => { setAnchor2(e.currentTarget); }}
              >
                Admin
              </Button>
              <Menu
                anchorEl={anchor2}
                open={open2}
                onClose={() => { setAnchor2(null) }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={() => { setAnchor2(null) }}><Link to="/admin/dashboard" style={{ color: "black" }} >Dashboard</Link></MenuItem>
                <MenuItem onClick={() => { setAnchor2(null) }}><Link to="/admin/orders" style={{ color: "black" }} >Orders   </Link></MenuItem>
                <MenuItem onClick={() => { setAnchor2(null) }}><Link to="/admin/products" style={{ color: "black" }} >Products </Link></MenuItem>
                <MenuItem onClick={() => { setAnchor2(null) }}><Link to="/admin/users" style={{ color: "black" }} >Users    </Link></MenuItem>
              </Menu>
            </div>
          )}
        </div>
      </header>
      {size.width < 600 && (<SearchBar selected={selected} />)}
    </>
  )
}
