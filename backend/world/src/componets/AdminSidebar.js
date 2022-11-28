import { List, ListItem } from '@mui/material';
import { Link } from 'react-router-dom';

export default function AdminSidebar() {
    return (
        <List>
            <ListItem>
                <Link to="/admin/dashboard"> Dashboard </Link>
            </ListItem>
            <ListItem>
                <Link to="/admin/orders"> Orders </Link>
            </ListItem>
            <ListItem>
                <Link to="/admin/products" > Products </Link>
            </ListItem>
            <ListItem>
                <Link to="/admin/users"> Users </Link>
            </ListItem>
        </List>
    )
}
