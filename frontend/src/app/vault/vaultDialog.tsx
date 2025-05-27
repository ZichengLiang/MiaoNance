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

  function dialogTitle(variant: string) {
    // return the right <DialogTitle> element based on the variant 'delete' | 'edit'
    const dialogTitle_edit = <DialogTitle>Rename Notebook</DialogTitle>;
    const dialogTitle_delete = (
      <DialogTitle sx={{ color: "red" }}>
        {" "}
        <WarningAmber /> Delete Notebook
      </DialogTitle>
    );
    let returnElement = (
      <DialogTitle>
        Error: not a valid variant (app/vault/vaultDialog.tsx)
      </DialogTitle>
    );

    switch (variant) {
      case "edit":
        returnElement = dialogTitle_edit;
        break;
      case "delete":
        returnElement = dialogTitle_delete;
        break;
      default:
        break;
    }
    return returnElement;
  }

  function dialogContentText(variant: string) {
    // return the right <DialogContentText> element based on the variant 'delete' | 'edit'
    const dialogContentText_edit = (
      <DialogContentText>
        Please type in your preferred notebook title:
      </DialogContentText>
    );

    const dialogContentText_delete = (
      <DialogContentText>
        Please type in the notebook title{" "}
        <span className="font-bold">{notebook.title}</span> to confirm deletion:
        <br />
        {!deleteValidated &&
          `⚠️The title doesn't match. Please check your spelling and capitalization.`}
      </DialogContentText>
    );

    let returnElement = (
      <DialogContentText>
        Error: not a valid variant (app/vault/vaultDialog.tsx)
      </DialogContentText>
    );

    switch (variant) {
      case "edit":
        returnElement = dialogContentText_edit;
        break;
      case "delete":
        returnElement = dialogContentText_delete;
        break;
      default:
        break;
    }
    return returnElement;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            // Get the user input from the submission
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            console.log(formJson);
            const userInput = formJson.title;
            // Now the user input is ready, run the logic...
            let shouldClose= true;
            switch (variant) {
              case "edit":
                handleEdit(notebook, userInput);
                break;
              case "delete":
                // Here handleDelete verify the user input with the notebook name
                // shouldClose will be true if it's validated
                shouldClose = handleDelete(notebook, userInput);
                setDeleteValidated(shouldClose);
                break;
              default:
                break;
            }
            if (shouldClose) {
              handleClose();
            }
          },
        },
      }}
    >
      {/* The Dialog Title*/}
      {dialogTitle(variant)}

      {/* The Dialog Content*/}
      <DialogContent>
        {dialogContentText(variant)}
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
