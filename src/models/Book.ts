export interface Book {
  id: number;
  name: string;
  description: string;
  publication_year: number | null;
  author: string;
  gender: string;
  created_at: Date;
  updated_at: Date;
}

export type BookCreate = Omit<Book, "id" | "created_at" | "updated_at">;

export interface BookRequest extends Omit<BookCreate, "publicationYear"> {
  publication_year: number;
}

export interface BookResponse extends BookRequest {
  id: number;
}
