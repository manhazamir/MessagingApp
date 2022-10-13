import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

const useStyles = makeStyles(() => ({
  messageInput: {
    display: "flex",

    width: " 80%",
    flex: 1,
    border: "none",
    fontSize: 17,
    paddingLeft: 10,
    background: "none",
    color: " #134696",
    "&:focus": {
      outline: "none",
    },
  },
  iconPosition: {
    textAlign: "center",
    position: "relative",
    top: "30%",
  },
}));

function ChatArea({ selectedContact }) {
  const classes = useStyles();
  const [message, setMessage] = useState();
  const [newMessage, setNewMessage] = useState();
  const [chatMessages, setChatMessages] = useState();
  const [sentTo, setSentTo] = useState();
  const [sentFrom, setSentFrom] = useState();

  const [chatSocketConnection, setChatSocketConnection] = useState();

  useEffect(() => {
    const user_id = localStorage.getItem("userID");
    console.log({ user_id });
    if (user_id === null) return;
    else {
      const url = `ws://127.0.0.1:8000/ws/socket-server?user_id=${user_id}`;
      const chatSocket = new WebSocket(url);
      console.log({ chatSocket });
      setChatSocketConnection(chatSocket);

      chatSocket.onmessage = function (e) {
        let data = JSON.parse(e.data);
        console.log("Data: ", data);

        if (data?.type === "chat") {
          // setChatMessages((prev) => ({ ...prev, a: data?.message }));
          setSentFrom(data?.sent_from);
          setSentTo(data?.sent_to);

          console.log("dskd", data);
          setChatMessages(data?.message);
        }
      };
    }

    // eslint-disable-next-line+++
  }, []);

  const handleSendMessage = () => {
    console.log({ message });
    if (chatSocketConnection) {
      if (message?.length === 0) return;
      else {
        const sentFromID = localStorage.getItem("userID");
        console.log({ sentFromID });
        if (sentFromID && selectedContact) {
          const sentToID = selectedContact?.id;
          chatSocketConnection.send(
            JSON.stringify({
              message: message,
              sent_from: sentFromID,
              sent_to: sentToID,
            })
          );
        } else console.log("User not logged in");
      }
    }
  };
  return (
    <div>
      <Box
        sx={{
          my: 2,

          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 200px)",
          border: "1px solid #00498e",
          borderRadius: 3,
        }}
      >
        {selectedContact ? (
          <>
            {" "}
            <Box
              sx={{
                m: 1,
                display: "flex",
                flexDirection: "column",
                height: "calc(100vh - 280px)",
                border: "1px solid #00498e",
                borderRadius: 3,
              }}
            >
              {/* {chatMessages &&
            chatMessages?.map((message) => <p>{JSON.stringify(message)}</p>)} */}
              {chatMessages && (
                <>
                  <p>{chatMessages}</p> by <p>{sentFrom}</p> to <>{sentTo}</>
                </>
              )}
            </Box>
            <Box
              sx={{
                mx: 1,
                display: "flex",
                flexDirection: "row",
                height: "50px",
                border: "1px solid #00498e",
                borderRadius: 3,
              }}
            >
              <input
                type="text"
                className={classes.messageInput}
                value={message}
                onChange={(e) => setMessage(e?.target?.value)}
              />
              <Button
                type="submit"
                variant="contained"
                style={{ backgroundColor: "#00489E" }}
                sx={{ my: 1, mr: 0.5 }}
                onClick={() => handleSendMessage()}
              >
                Send
              </Button>
            </Box>
          </>
        ) : (
          <div className={classes.iconPosition}>
            <ChatBubbleIcon sx={{ fontSize: 200, color: "#00489e" }} />
          </div>
        )}
      </Box>
    </div>
  );
}

export default ChatArea;
