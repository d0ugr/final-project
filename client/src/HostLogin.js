import React, { useState } from "react";
// import LockOpenIcon from "@material-ui/icons/LockOpen";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";



function HostLogin(props) {

  const [ dialogText, setDialogText ] = useState("Enter the host password to unlock host controls.");
  const [ password,   setPassword   ] = useState("");

  const hostLogin = (event) => {
    event.preventDefault();
    props.hostLogin(password, (err, pwMatch) => {
      if (err) {
        setDialogText(err);
      } else if (pwMatch) {
        props.closeHostLogin();
      } else {
        setDialogText("Incorrect password.");
      }
    });
  };

  const closeHostLogin = () => {
    setPassword("");
    props.closeHostLogin();
  }

  return (
    <Dialog fullWidth open={props.hostLoginOpen} onClose={closeHostLogin} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-host-password-dialog-title">Host access</DialogTitle>
      <form onSubmit={hostLogin}>
        <DialogContent>
          <DialogContentText>
            {dialogText}
          </DialogContentText>
          <TextField
            fullWidth
            margin="dense"
            id="name"
            label="Host password"
            type="password"
            value={password}
            autoFocus
            onChange={(event) => setPassword(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHostLogin} color="primary">
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={password.trim() ? false : true}
            onClick={hostLogin}
          >
            Login
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );

}

export default HostLogin;
