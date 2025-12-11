


import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, IconButton, List, ListItem, ListItemText, Checkbox, Box, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from "motion/react"

export default function App() {
  const [gifts, setGifts] = useState([])
  const [newGift, setNewGift] = useState({ from: "", to: "", gift: "" })
  const [checked, setChecked] = useState([]);
  const [swing, setSwing] = useState(false);

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
    const isChecked = checked.includes(id)
    setChecked(prev => {
      if (!isChecked) {
        setSwing(true);
        setTimeout(() => setSwing(false), 700);
        return [...prev, id];
      } else {
        return prev.filter(x => x !== id);
      }
    });
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
    <Container maxWidth="sm" sx={{ mt: 8, position: 'relative' }}>
      <Paper elevation={3} sx={{
        p: 4, borderWidth: 3, position: 'relative'
      }} >
        <motion.div
          animate={swing ? { rotate: [0, -8, 7, -6, 5, -4, 3, -2, 1, 0] } : { rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <Typography variant="h3" align="center" gutterBottom sx={{ fontFamily: 'Berkshire Swash, sans-serif', fontWeight: '700', marginBottom: 4, position: 'relative', zIndex: 1 }}>
            Christmas Gifts
          </Typography>
        </motion.div>
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
          <IconButton
            color="secondary"
            onClick={handleAdd}
          >
            <AddIcon />
          </IconButton>
        </Box>
        <List>
          {gifts.map(gift => (
            <motion.li
              key={gift.id}
              style={{ listStyle: 'none' }}
              initial={false}
              whileHover={{ scale: 1.02, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)' }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            >
              <ListItem
                sx={{ mb: 1, border: '1px solid #eee', borderRadius: 2, p: 0.5 }}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(gift.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <Checkbox
                  onChange={() => handleToggle(gift.id)}
                />
                <ListItemText
                  primary={
                    <span style={{ textDecoration: checked.includes(gift.id) ? 'line-through' : 'none' }}>
                      {gift.from} → {gift.to}: {gift.gift}
                    </span>
                  }
                />
              </ListItem>
            </motion.li>
          ))}
        </List>
        <Typography variant="body2" mt={2}>
          Your remaining gifts: {gifts.length - checked.length}
        </Typography>

      </Paper>
    </Container >
  );
}
