import React from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { NotebookMetadata } from "@/types/notebook_metadata";
import { WarningAmber } from "@mui/icons-material";

interface DialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  notebook: NotebookMetadata;
  variant: string;
  handleEdit: (notebook: NotebookMetadata, title: string) => void;
  handleDelete: (notebook: NotebookMetadata, title: string) => boolean;
}

export default function VaultDialog({
  isOpen,
  setIsOpen,
  notebook,
  variant,
  handleEdit,
  handleDelete,
}: DialogProps) {
  const [deleteValidated, setDeleteValidated] = React.useState(true);

  const handleClose = () => {
    setIsOpen(false);
    setDeleteValidated(true);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            console.log(formJson);

            const userInput = formJson.title;
            if (variant === "edit") {
              handleEdit(notebook, userInput);
            }
            let deleted = true;
            if (variant === "delete") {
              deleted = handleDelete(notebook, userInput);
              setDeleteValidated(deleted);
            }
            //console.log(email);
            if (deleted) {
              handleClose();
            }
          },
        },
      }}
    >
      {variant === "delete" && (
        <DialogTitle sx={{ color: "red" }}>
          {" "}
          <WarningAmber /> Delete Notebook
        </DialogTitle>
      )}
      {variant === "edit" && <DialogTitle>Rename Notebook</DialogTitle>}
      <DialogContent>
        {variant === "delete" && (
          <DialogContentText>
              Please type in the notebook title <span className="font-bold">{notebook.title}</span> to confirm
              deletion:
              <br/>
            {!deleteValidated && 
              `⚠️The title doesn't match. Please check your spelling and capitalization.`
            }
          </DialogContentText>
        )}
        {variant === "edit" && (
          <DialogContentText>
            Please type in your preferred notebook title:
          </DialogContentText>
        )}
        <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          name="title"
          label={variant === "edit" ? "New Notebook Title" : "Notebook Title"}
          inputProps={{ "data-testid": "content-input" }}
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
