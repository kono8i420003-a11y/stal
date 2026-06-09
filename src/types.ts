export interface TrialRequest {
  id: string;
  name: string;
  phone: string;
  studentAge: number;
  submittedAt: string;
  status: 'new' | 'contacted' | 'completed';
}

export interface FeedbackMessage {
  id: string;
  name: string;
  phone: string;
  age: number;
  message: string;
  submittedAt: string;
  status: 'unread' | 'read' | 'replied';
}
