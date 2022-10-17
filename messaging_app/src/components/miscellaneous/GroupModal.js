import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@mui/styles";
import { createNewGroup } from "../../redux/slices/contactsSlice";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
};

const useStyles = makeStyles(() => ({
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

function GroupModal({ groupModalOpen, setGroupModalOpen, contacts }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [groupName, setGroupName] = useState();
  const [checkedCheckboxes, setCheckedCheckboxes] = useState([]);
  const [usersID, setUsersID] = useState([]);

  useEffect(() => {
    console.log({ contacts });
  }, []);

  const handleCreateGroup = () => {
    const groupData = {
      user_fk: localStorage.getItem("userID"),
      group_name: groupName,
      users: usersID,
    };

    console.log({ groupData });

    dispatch(createNewGroup(groupData));
    setGroupModalOpen(false);
  };

  const handleCheckboxChange = (data) => {
    const isChecked = checkedCheckboxes.some(
      (checkedCheckbox) => checkedCheckbox.id === data.id
    );
    if (isChecked) {
      setCheckedCheckboxes(
        checkedCheckboxes.filter(
          (checkedCheckbox) => checkedCheckbox.id !== data.id
        )
      );
    } else {
      setCheckedCheckboxes(checkedCheckboxes.concat(data));
      setUsersID(usersID.concat(data?.id));
    }
  };
  return (
    <Modal
      open={groupModalOpen}
      onClose={() => setGroupModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={{ padding: 3 }}
    >
      <Box sx={modalStyle}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          style={{ marginBottom: 30 }}
        >
          Create a new group
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
            id="groupName"
            label="Group Name"
            name="groupName"
            onChange={(event) => setGroupName(event?.target?.value)}
            autoFocus
            autoComplete="family-name"
          />
          <p style={{ fontSize: 14, color: "#00498e" }}>
            Select all the members for your new group
          </p>
          <div
            className={classes.scrollbar}
            style={{
              width: "100%",
              maxHeight: "calc(100vh - 600px)",
              overflowY: "auto",
            }}
          >
            {contacts.map((contact, index) => (
              <div style={{ display: "flex", flexDirection: "row" }}>
                <input
                  key={`cb-${index}`}
                  value={contact?.id}
                  type="checkbox"
                  checked={checkedCheckboxes.some(
                    (checkedCheckbox) => checkedCheckbox.id === contact?.id
                  )}
                  onChange={() => handleCheckboxChange(contact)}
                />
                <p>
                  {contact?.fname} {contact?.lname}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              onClick={handleCreateGroup}
              sx={{ mt: 3, mb: 2 }}
              style={{
                fontWeight: 500,
              }}
            >
              Create
            </Button>
          </div>
        </Box>
      </Box>
    </Modal>
  );
}

export default GroupModal;
