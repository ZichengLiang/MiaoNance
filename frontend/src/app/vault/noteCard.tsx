import React from "react";
import {Card, CardContent, CardActionArea, Typography} from '@mui/material';
import { Notebook } from "@/types/notebook";

export default function NoteCard({notebook}) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea href={`${notebook.uuid}`}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {notebook.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {notebook.createdAt.toLocaleDateString()}
          </Typography>
        </CardContent> 
      </CardActionArea>
    </Card>
  );
}
