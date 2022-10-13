import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
};
function BroadcastModal({ broadcastModalOpen, setBroadcastModalOpen }) {
  const [message, setMessage] = useState();
  return (
    <Modal
      open={broadcastModalOpen}
      onClose={() => setBroadcastModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={{ padding: 3 }}
    >
      <Box sx={modalStyle}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          style={{ marginBottom: 15 }}
        >
          Send a broadcast message
        </Typography>

        <Box
          component="form"
          //   className={classes.modalFields}
          noValidate
          //   onSubmit={handleEditDestination}
        >
          <TextField
            fullWidth
            variant="outlined"
            multiline
            maxRows={10}
            id="message"
            label="Message"
            name="message"
            onChange={({ value }) => setMessage(value)}
            autoFocus
            autoComplete="family-name"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              type="submit"
              sx={{ mt: 3, mb: 2 }}
              style={{
                fontWeight: 500,
              }}
            >
              Send
            </Button>
          </div>
        </Box>
      </Box>
    </Modal>
  );
}

export default BroadcastModal;
