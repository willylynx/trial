export interface SearchResult {
  id: string;
  title: string;
  description: string;
  source: string;
  category: string;
  visibility: 'public' | 'private';
  uploader: {
    name: string;
    avatar: string;
  };
  uploadDate: string;
  views: number;
  downloads: number;
  comments: number;
  tags: string[];
  originalUrl: string;
}

export interface FilterState {
  category: string;
  country: string;
  sortBy: string;
}

export interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string; // Now supports HTML content
  date: string;
  likes: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
}