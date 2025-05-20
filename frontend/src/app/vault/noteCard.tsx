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
import { Notebook } from "@/types/notebook";

interface NoteCardProps{
  notebook: Notebook;
  notebooks: Notebook[];
  // the type React.Dispatch... is used for React setState(), it allows both direct state updates and functional updates.
  setNotebooks: React.Dispatch<React.SetStateAction<Notebook[]>>;
}

export default function NoteCard({ notebook, setNotebooks }: NoteCardProps) {
  const [notebookTitle, setTitle] = React.useState(notebook.title)

  function handleEditTitle() {
    return ;
  }

  return (
    <Card sx={{ maxWidth: 500 }}>
      <CardActionArea href={`${notebook.uuid}`}>
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
          <Button size="small" color="primary" onClick={() => {handleEditTitle()}}>
            <Edit/>
          </Button>
        </Tooltip>
        <Tooltip title="Delete this notebook" placement="bottom">
          <Button size="small" color="primary">
            <Delete/>
          </Button>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
