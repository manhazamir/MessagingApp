import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import Box from "@mui/material/Box";
import { useSelector, useDispatch } from "react-redux";
import { getContacts } from "../../../redux/slices/contactsSlice";
import { Avatar } from "@mui/material";
import { getRandomColor } from "../../../utils/Constants";
import SearchIcon from "@mui/icons-material/Search";
import Divider from "@mui/material/Divider";
import GroupModal from "../../miscellaneous/GroupModal";
import BroadcastModal from "../../miscellaneous/BroadcastModal";
import { createUsersThread } from "../../../redux/slices/contactsSlice";

const useStyles = makeStyles(() => ({
  container: {
    padding: 10,
    boxShadow: "rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
    overflowY: "auto",
    marginTop: 25,
  },
  contactsWrapper: {
    cursor: "pointer",
  },
  alignContacts: {
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
  },
  userInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
  },
  userDetail: {
    display: "flex",
    alignItems: "center",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "3px 20px",
    borderRadius: 30,
    border: "1px solid black",
    height: 30,
    width: "80%",
    maxWidth: "80%",
    marginBottom: 15,
  },
  input: {
    display: "flex",
    flex: 1,
    border: "none",
    fontSize: 14,
    background: "none",
    color: "white",
    "&:focus": {
      outline: "none",
    },
    "&:placeholder": {
      color: "white",
    },
  },
  searchInput: {
    display: "flex",
    flex: 1,
    border: "none",
    fontSize: 14,
    background: "none",
    color: " #134696",
    "&:focus": {
      outline: "none",
    },
  },
  links: {
    fontSize: 14,
    color: "blue",
    borderBottom: "1px solid blue",
    cursor: "pointer",
  },
  scrollbar: {
    "&::-webkit-scrollbar": {
      width: "0.3em",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
      background: "#f1f1f1",
      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#014493",
      borderRadius: 20,
      padding: 5,
    },
  },
}));

function Contacts({ selectContact }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [contacts, setContacts] = useState();

  const [searchContact, setSearchContact] = useState();
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);

  const contactsResponse = useSelector(
    (state) => state.contacts.contactsResponse
  );
  const contactsResponseError = useSelector((state) => state.contacts.error);

  useEffect(() => {
    if (!contactsResponse || !contactsResponse?.length) {
      dispatch(getContacts());
    }
  }, []);
  useEffect(() => {
    if (contactsResponse) {
      console.log({ contactsResponse });
      const currentUser = localStorage.getItem("username");
      console.log({ currentUser });
      setContacts(
        contactsResponse.filter((contact) => contact?.username !== currentUser)
      );
    }
  }, [contactsResponse]);

  useEffect(() => {
    if (contacts) {
      console.log({ contacts });
    }
  }, [contacts]);

  const handleClickContact = (contact) => {
    console.log({ contact });
    selectContact(contact);
    const threadData = {
      user1: parseInt(localStorage.getItem("userID")),
      user2: contact?.id,
    };
    console.log({ threadData });
    dispatch(createUsersThread(threadData));
  };

  const getFilteredContacts = () => {
    if (!searchContact) return contacts;
    return contacts?.filter(
      (contact) =>
        contact?.fname?.toLowerCase().includes(searchContact.toLowerCase()) ||
        contact?.lname?.toLowerCase().includes(searchContact.toLowerCase())
    );
  };

  const filteredContacts = getFilteredContacts();

  return (
    <Box
      sx={{
        my: 3,
        mx: 2,
        display: "flex",
        flexDirection: "column",
        // height: "100vh",
        border: "1px solid #00498e",
        borderRadius: "16px",
        alignItems: "flex-start",
        padding: "16px",
        gap: "4px",
        // position: "relative",
      }}
    >
      <div className={classes.searchContainer}>
        <input
          type="text"
          className={classes.searchInput}
          placeholder={"Search contacts"}
          value={searchContact}
          onChange={(e) => setSearchContact(e?.target?.value)}
        />
        <SearchIcon />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <p className={classes.links} onClick={() => setGroupModalOpen(true)}>
          Add a new group
        </p>
        <p
          className={classes.links}
          onClick={() => setBroadcastModalOpen(true)}
        >
          Send Broadcast
        </p>
      </div>
      <Divider light />

      {groupModalOpen && (
        <GroupModal
          groupModalOpen
          setGroupModalOpen={setGroupModalOpen}
          contacts={contacts}
        />
      )}

      {broadcastModalOpen && (
        <BroadcastModal
          broadcastModalOpen
          setBroadcastModalOpen={setBroadcastModalOpen}
        />
      )}
      <div
        className={classes.scrollbar}
        style={{
          width: "100%",
          maxHeight: "calc(100vh - 275px)",
          overflowY: "auto",
        }}
      >
        {filteredContacts?.map((contact, index) => {
          return (
            <div
              className={classes.contactsWrapper}
              onClick={() => {
                handleClickContact(contact);
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Avatar
                  alt={contact?.fname?.toUpperCase()}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: index % 2 === 0 ? "#2a3eb1" : "#00a0b2",
                    //00b0ff, 1c54b2
                    fontSize: 100,
                  }}
                />
                <div className={classes.userInfo}>
                  <div className={classes.userDetail}>
                    <h4>
                      {contact?.fname} {contact?.lname}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Box>
  );
}

export default Contacts;
