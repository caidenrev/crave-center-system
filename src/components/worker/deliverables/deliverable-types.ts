export interface DeliverableItem {
  id: string;
  projectId: string;
  projectTitle: string;
  clientName: string;
  fileUrl: string;
  description: string | null;
  status: string;
  createdAt: string;
}

export interface ActiveProjectItem {
  id: string;
  title: string;
}
