import React from "react";
import {
  Button,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  CardActions,
  Tooltip,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { NotebookMetadata } from "@/types/notebook_metadata";
import VaultDialog from "./vaultDialog";

interface NoteCardProps {
  notebook: NotebookMetadata;
  notebooks: NotebookMetadata[];
  // the type React.Dispatch... is used for React setState(), it allows both direct state updates and functional updates.
  setNotebooks: React.Dispatch<React.SetStateAction<NotebookMetadata[]>>;
}

export default function NoteCard({
  notebook,
  notebooks,
  setNotebooks,
}: NoteCardProps) {
  // states
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogVariant, setDialogVariant] = React.useState('edit');

  // functions
  function invokeDialog(variant: 'delete' | 'edit') {
    setOpenDialog(true);
    setDialogVariant(variant);
  }

  function handleEdit(notebook: NotebookMetadata, title: string) {
    // A helper function when we edit the title
    function editTitle(target: NotebookMetadata): NotebookMetadata {
      // Leave non-target item alone...
      if (notebook.uuid !== target.uuid) {
        return { ...target };
      }
      // Leave everything else the same, only change the title
      return {
        ...target,
        title: title,
      };
    }

    const newNotebooks: NotebookMetadata[] = notebooks.map(editTitle);
    setNotebooks(newNotebooks);
  }

  function handleDelete(notebook: NotebookMetadata, title:string) {
    const inputOK = title === notebook.title;
    if (inputOK) {
      setNotebooks(notebooks.filter((item) => item.uuid !== notebook.uuid));
    }
    return inputOK;
  }

  return (
    <>
      <Card sx={{ maxWidth: 500 }}>
        <CardActionArea href={`/vault/${notebook.uuid}`}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {notebook.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {notebook.createdAt.toLocaleDateString()}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Tooltip title="Rename this notebook" placement="bottom">
            <Button
              size="small"
              sx={{ color: "primary" }}
              onClick={() => invokeDialog('edit')}
            >
              <Edit />
            </Button>
          </Tooltip>
          <Tooltip title="Delete this notebook" placement="bottom">
            <Button
              size="small"
              sx={{ color: "#ff3d00" }}
              onClick={() => invokeDialog('delete')}
            >
              <Delete />
            </Button>
          </Tooltip>
        </CardActions>
      </Card>
      <VaultDialog
        isOpen={openDialog}
        setIsOpen={setOpenDialog}
        variant={dialogVariant}
        notebook={notebook}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </>
  );
}
