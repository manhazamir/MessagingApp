import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { getContacts } from "../../../redux/slices/contactsSlice";
import { useSelector, useDispatch } from "react-redux";

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

function ChatArea({ selectedContact, selectedGroup, broadcastMsg, threadID }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [message, setMessage] = useState();
  const [newMessage, setNewMessage] = useState();
  const [chatMessages, setChatMessages] = useState();
  const [sentTo, setSentTo] = useState();
  const [sentFrom, setSentFrom] = useState();

  const [groupUsers, setGroupUsers] = useState();

  const contactsResponse = useSelector(
    (state) => state.contacts.contactsResponse
  );

  const [chatSocketConnection, setChatSocketConnection] = useState();

  useEffect(() => {
    if (!contactsResponse || !contactsResponse?.length) {
      dispatch(getContacts());
    }
  }, []);
  useEffect(() => {
    if (contactsResponse && selectedGroup) {
      console.log("yay");
      console.log({ selectedGroup });
      selectedGroup?.users?.map((user) => console.log(user));
      console.log({ contactsResponse });
      const currentUser = localStorage.getItem("username");
      console.log({ currentUser });
      setGroupUsers(
        contactsResponse.filter((contact) => {
          return selectedGroup?.users?.some((user) => {
            return user === contact?.id;
          });
        })
      );
    }
  }, [contactsResponse, selectedGroup]);

  useEffect(() => {
    const logged_user = localStorage.getItem("userID");
    console.log({ selectedContact });
    console.log({ logged_user });
    if (logged_user === null || selectedContact === null || !selectedContact)
      return;
    else {
      const url = `ws://127.0.0.1:8000/ws/socket-server/?logged_user=${logged_user}`;
      const chatSocket = new WebSocket(url);

      console.log({ chatSocket });

      setChatSocketConnection(chatSocket);

      // when server sends a msg
      chatSocket.onmessage = function (e) {
        let data = JSON.parse(e.data);
        console.log("Data: ", data);

        if (data?.type === "chat_message") {
          // setChatMessages((prev) => ({ ...prev, a: data?.message }));
          setSentFrom(data?.sent_from);
          setSentTo(data?.sent_to);

          console.log("dskd", data);
          setChatMessages(data?.message);
        }
      };
    }

    // eslint-disable-next-line
  }, [selectedContact]);

  useEffect(() => {
    console.log("");
  }, [groupUsers]);

  const handleSendMessage = () => {
    console.log({ message });
    if (chatSocketConnection) {
      if (message?.length === 0) return;
      else {
        const sentFromID = localStorage.getItem("userID");
        console.log({ sentFromID });
        if (sentFromID && selectedContact && threadID) {
          const sentToID = selectedContact?.id;

          // sending msg to server
          chatSocketConnection.send(
            JSON.stringify({
              message: message,
              sent_by: sentFromID,
              send_to: sentToID,
              thread_id: threadID,
            })
          );
        } else console.log("User not logged in");
      }
    }
  };
  return (
    <div>
      <Box
        style={
          selectedContact
            ? { background: "#00a0b2" }
            : selectedGroup
            ? { background: "#00498e" }
            : null
        }
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
            <Box
              sx={{
                m: 1,
                display: "flex",
                flexDirection: "column",
                height: "calc(100vh - 280px)",
                border: "1px solid #00498e",
                borderRadius: 3,
                background: "white",
              }}
            >
              {/* {chatMessages &&
            chatMessages?.map((message) => <p>{JSON.stringify(message)}</p>)} */}
              {chatMessages && (
                <>
                  <p>{chatMessages}</p> by <p>{sentFrom}</p> to <>{sentTo}</>
                </>
              )}
              {(localStorage.getItem("broadcastID") ===
                localStorage.getItem("userID") ||
                parseInt(localStorage.getItem("broadcastID")) ===
                  selectedContact?.id) && (
                <>
                  {broadcastMsg &&
                    (localStorage.getItem("broadcastID") ===
                    localStorage.getItem("userID") ? (
                      <div
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <p
                          style={{
                            fontSize: 16,
                            padding: 10,
                            border: "2px solid #00489e",
                            borderRadius: 10,
                            margin: 20,
                            width: "30%",
                            maxWidth: "50%",
                          }}
                        >
                          {broadcastMsg} -{" "}
                          <span style={{ color: "#606060", fontSize: 13 }}>
                            Sent by {localStorage.getItem("broadcastBy")}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p
                          style={{
                            fontSize: 16,
                            padding: 10,
                            border: "2px solid #00a0b2",
                            borderRadius: 10,
                            margin: 20,
                            width: "30%",
                            maxWidth: "50%",
                          }}
                        >
                          {broadcastMsg} -{" "}
                          <span style={{ color: "#606060", fontSize: 13 }}>
                            Sent by {localStorage.getItem("broadcastBy")}
                          </span>
                        </p>
                      </div>
                    ))}
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
                background: "white",
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
        ) : selectedGroup ? (
          <>
            <Box
              sx={{
                m: 1,
                display: "flex",
                flexDirection: "column",
                height: "calc(100vh - 280px)",
                border: "1px solid #00498e",
                borderRadius: 3,
                background: "white",
              }}
            >
              <>
                <Box
                  sx={{
                    m: 1,
                    p: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: "50px",
                    border: "1px solid #00498e",
                    borderRadius: 3,
                    background: "white",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <p
                      style={{
                        fontWeight: "600",
                        marginRight: 5,
                      }}
                    >
                      Users added:
                    </p>

                    {groupUsers?.map((user) => (
                      <p style={{ margin: "17px 0px 0px 5px", fontSize: 15 }}>
                        {user?.fname} {user?.lname} |
                      </p>
                    ))}
                  </div>
                </Box>
              </>
            </Box>
            <Box
              sx={{
                mx: 1,
                display: "flex",
                flexDirection: "row",
                height: "50px",
                border: "1px solid #00498e",
                borderRadius: 3,
                background: "white",
              }}
            >
              <input
                type="text"
                className={classes.messageInput}
                // value={message}
                // onChange={(e) => setMessage(e?.target?.value)}
              />
              <Button
                type="submit"
                variant="contained"
                style={{ backgroundColor: "#00489E" }}
                sx={{ my: 1, mr: 0.5 }}
                // onClick={() => handleSendMessage()}
              >
                Send
              </Button>
            </Box>
          </>
        ) : (
          <div className={classes.iconPosition}>
            <ChatBubbleIcon sx={{ fontSize: 200, color: "#00a0b2" }} />
          </div>
        )}
      </Box>
    </div>
  );
}

export default ChatArea;
