


import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, IconButton, List, ListItem, ListItemText, Checkbox, Box, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { SpaRounded } from '@mui/icons-material';

export default function App() {
  const [gifts, setGifts] = useState([])
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    fetch("/api/gifts")
      .then(res => res.json())
      .then(data => {
        setGifts(data)
        console.log('Fetched gifts:', data);
      })
      .catch(err => console.error("Uups: " + err.message))
  }, [])

  const handleToggle = (id) => {
    setChecked(prev =>
      checked.includes(id) ?
        prev.filter(x => x !== id) :
        [...prev, id])
  }
  const handleDelete = (id) => {
    fetch(`/api/gifts/${id}`, { method: "DELETE" })
      .catch(err => console.error("OhOh: " + err.message))
    console.log("..deleting a gift with id: " + id);
    setGifts(prev => prev.filter(x => x.id !== id))
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 3, borderWidth: 3 }} >
        <Typography variant="h4" align="center" gutterBottom sx={{}}>
          Christmas Gifts
        </Typography>
        <List>
          {gifts.map(gift => (
            <ListItem
              key={gift.id}
              sx={{ mb: 1, border: '1px solid #eee', borderRadius: 2 }}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(gift.id)}>
                  <DeleteIcon />
                </IconButton>
              }>
              <Checkbox
                onChange={() => handleToggle(gift.id)}
              />
              <ListItemText
                primary={
                  <span style={{ textDecoration: checked.includes(gift.id) ? 'line-through' : 'none' }}>
                    {gift.from} → {gift.to}: {gift.gift}
                  </span>
                } />

            </ListItem>
          ))}
        </List>
        <Typography variant="body2" mt={2}>
          Your remaining gifts: {gifts.length - checked.length}
        </Typography>

      </Paper>
    </Container>
  );
}
