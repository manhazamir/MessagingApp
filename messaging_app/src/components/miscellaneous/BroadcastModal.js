import React, { useState, useEffect } from "react";
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
function BroadcastModal({
  broadcastModalOpen,
  setBroadcastModalOpen,
  contacts,
  setBroadcastMsg,
}) {
  const [message, setMessage] = useState();
  const [socketConnection, setSocketConnection] = useState();

  useEffect(() => {
    const url = `ws://127.0.0.1:8000/ws/broadcast-message/`;
    const chatSocket = new WebSocket(url);

    setSocketConnection(chatSocket);

    chatSocket.onmessage = function (e) {
      let data = JSON.parse(e.data);
      console.log("Data: ", data);

      if (data?.type === "broadcast") {
        console.log({ data });
        setBroadcastMsg(data?.message);
        localStorage.setItem("broadcastBy", data?.sent_by_username);
        localStorage.setItem("broadcastID", data?.sent_by_id);
      }
    };
  }, []);

  const handleSendBroadcastMessage = () => {
    if (message === null) {
      console.log("Cannot send an empty message");
      return;
    } else {
      if (socketConnection) {
        const sent_by = localStorage.getItem("userID");
        const send_to = [];

        console.log({ contacts });
        console.log(message);

        for (let index in contacts) {
          send_to.push(contacts[index]?.id);
        }

        console.log({ send_to });

        // broadcast msg

        socketConnection.send(
          JSON.stringify({
            message: message,
            sent_by: sent_by,
            send_to: send_to,
          })
        );
        setBroadcastModalOpen(false);
      }
    }
  };
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
            onChange={(event) => setMessage(event?.target?.value)}
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
              onClick={() => handleSendBroadcastMessage()}
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
