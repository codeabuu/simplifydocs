export interface HistoryItem {
    id: string; // Unique ID
    type: 'chat' | 'spreadsheet' | 'pdf'; // Type of activity
    content: {
      query?: string; // For chat
      fileId?: string; // For spreadsheet or PDF
      result?: string; // Analysis result or chat response
    };
    timestamp: string; // Date and time
  }