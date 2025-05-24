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

  function handleEditTitle(notebook: NotebookMetadata){

    // A helper function when
    function editTitle(target: NotebookMetadata): NotebookMetadata  {
      // Leave non-target item alone...
      if (notebook.uuid !== target.uuid) { return {...target};}

      return {
        ...target,
        title: notebook.uuid
      };
    }

    const newArr: NotebookMetadata[] = notebooks.map(editTitle);
    setNotebooks(newArr);
    /* TODO: instead of UUID, let user type its name */
  }

  function handleDelete(notebook: NotebookMetadata) {
    setNotebooks(notebooks.filter((item) => item.uuid !== notebook.uuid));
  }

  /*
    const handleDate = (date: string | Date) => {
        if (typeof date === 'string') {
          const realDate = new Date(date);
          console.info(`handleDate: ${realDate}`);
          return realDate;
        }
        return date;
    }
  */

  return (
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
            onClick={() => handleEditTitle(notebook)}
          >
            <Edit />
          </Button>
        </Tooltip>
        <Tooltip title="Delete this notebook" placement="bottom">
          <Button
            size="small"
            sx={{ color: "#ff3d00" }}
            onClick={() => handleDelete(notebook)}
          >
            <Delete />
          </Button>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
