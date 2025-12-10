


import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, IconButton, List, ListItem, ListItemText, Checkbox, Box, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { SpaRounded } from '@mui/icons-material';

export default function App() {
  const [gifts, setGifts] = useState([])
  const [newGift, setNewGift] = useState({ from: "", to: "", gift: "" })
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

  const handleAdd = () => {
    if (newGift.from && newGift.to && newGift.gift) {
      fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGift)
      }).then(res => res.json())
        .then(added => setGifts(prev => [...prev, added]))
        .catch(err => console.error("Cant do it.. : " + err.message))

      // reset
      setNewGift({ from: "", to: "", gift: "" })
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderWidth: 3 }} >
        <Typography variant="h3" align="center" gutterBottom sx={{ fontFamily: 'Berkshire Swash, sans-serif', fontWeight: '700', marginBottom: 4 }}>
          Christmas Gifts
        </Typography>
        <Box display="flex" gap={2} mb={4}>
          <TextField
            size="small"
            fullWidth
            label="From"
            value={newGift.from}
            onChange={(e) => setNewGift({ ...newGift, from: e.target.value })} />
          <TextField
            size="small"
            fullWidth
            label="To"
            value={newGift.to}
            onChange={(e) => setNewGift({ ...newGift, to: e.target.value })} />
          <TextField
            size="small"
            fullWidth
            label="Gift"
            value={newGift.gift}
            onChange={(e) => setNewGift({ ...newGift, gift: e.target.value })} />
          <IconButton color="primary" onClick={handleAdd} sx={{ alignSelf: 'center' }}>
            <AddIcon />
          </IconButton>
        </Box>
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
    </Container >
  );
}
