export interface Book {
  id: number;
  name: string;
  description: string;
  publication_year: number | null;
  author: string;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookCreate = Omit<Book, "id" | "createdAt" | "updatedAt">;

export interface BookRequest extends Omit<BookCreate, "publicationYear"> {
  publication_year: number;
}

export interface BookResponse extends BookRequest {
  id: number;
}
