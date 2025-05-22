export interface NotebookMetadata {
  title: string;
  createdAt: Date;
  // We will use lastUpdated as the default sort comparator
  lastUpdatedAt: Date; 
  uuid: string;
}
