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
  const [notebookTitle, setTitle] = React.useState(notebook.title);

  function handleEditTitle(notebook: NotebookMetadata) {
    /* TODO: instead of UUID, let user type its name */
    setTitle(notebook.uuid);
    notebook.title = notebook.uuid;
  }

  function handleDelete(notebook: NotebookMetadata) {
    setNotebooks(notebooks.filter((item) => item.uuid !== notebook.uuid));
  }

  return (
    <Card sx={{ maxWidth: 500 }}>
      <CardActionArea href={`/vault/${notebook.uuid}`}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {notebookTitle}
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
            color="primary"
            onClick={() => handleEditTitle(notebook)}
          >
            <Edit />
          </Button>
        </Tooltip>
        <Tooltip title="Delete this notebook" placement="bottom">
          <Button
            size="small"
            color="primary"
            onClick={() => handleDelete(notebook)}
          >
            <Delete />
          </Button>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
