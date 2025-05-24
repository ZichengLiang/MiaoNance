export interface NotebookMetadata {
  title: string;
  createdAt: Date;
  // We will use lastUpdated as the default sort comparator
  updatedAt: Date; 
  uuid: string;
  // In frontend this will be the user's uuid
  user_id?: string;
  trading_pairs?: String[];
}
