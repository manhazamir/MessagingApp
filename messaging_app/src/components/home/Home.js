import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import Contacts from "./subcomponents/Contacts";
import ChatArea from "./subcomponents/ChatArea";

function Home() {
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState();

  useEffect(() => {
    console.log(selectedContact);
  }, [selectedContact]);

  const handleLogout = () => {
    localStorage.clear();
    console.log("log 1", localStorage.getItem("token"));
    localStorage.removeItem("token");
    console.log("log 2", localStorage.getItem("token"));

    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          height: 50,
          background: "#00498e",
          justifyContent: "space-between",
        }}
      >
        <p></p>
        <Typography component="h5" sx={{ color: "white", mt: 1.5 }}>
          Messaging App
        </Typography>
        <Button
          variant="contained"
          style={{ backgroundColor: "#00489E" }}
          // sx={{ mt: 3, mb: 2 }}
          onClick={() => handleLogout()}
        >
          Logout
        </Button>
      </Box>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 5, md: 12 }}
        justifyContent={"center"}
        sx={{
          height: "100vh",
          overflowX: "hidden",
        }}
      >
        <Grid item xs={3.5} md={3.5}>
          <Contacts selectContact={setSelectedContact} />
        </Grid>
        <Grid item xs={8} md={8} sx={{ marginTop: 0, paddingLeft: 0 }}>
          <Box
            sx={{
              display: "flex",
              height: 50,
              // background: "#f0f0f0",
              marginTop: 3,
              border: "1px solid #00498e",
              justifyContent: "space-between",
              borderRadius: 1,
            }}
          >
            <p></p>
            <Typography component="div" sx={{ color: "black", mt: 1.5 }}>
              {selectedContact ? (
                <>
                  {selectedContact?.fname} {selectedContact?.lname}
                </>
              ) : (
                "Select a user to start conversation"
              )}
            </Typography>
            <p></p>
          </Box>
          <ChatArea selectedContact={selectedContact} />
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;
