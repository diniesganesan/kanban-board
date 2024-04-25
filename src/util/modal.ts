export interface IProcess {
  type: 'Backlog' | 'Development' | 'Testing' | 'Completed';
  tasks: ITasks[];
}

export interface ITasks {
  id: string;
  title: string;
  description: string;
  severity: string;
  comments: string[];
}
