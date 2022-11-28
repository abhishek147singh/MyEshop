import { Button, Divider, InputBase, Paper } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar(props) {
    
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();
        navigate(query ? `/search/?query=${query}` : '/search');
      }

    return (
            <Paper
                component="form"
                sx={{ p: '2px 4px', m: 'auto', display: props.selected ? 'flex' : 'none', alignItems: 'center', width: 250 }}
                onSubmit={submitHandler}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search"
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Divider sx={{ height: 30, m: 0 }} orientation="vertical" />

                <Button type="submit">
                    <SearchIcon />
                </Button>
            </Paper>
    );
}