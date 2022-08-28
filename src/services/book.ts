import type { Book, BookCreate } from "@/models/Book";
import axios from "./axios";

function toBook(book: Book) {
  return {
    ...book,
    created_at: new Date(book.created_at),
    updated_at: new Date(book.updated_at),
  };
}
export class BookService {
  static get path() {
    return "/books";
  }

  static async getAll(): Promise<Book[]> {
    const response = await axios.get<Book[]>(BookService.path);
    return response.data.map(toBook);
  }

  static async create(data: BookCreate) {
    await axios.post(BookService.path, data);
  }

  static async getById(id: string | number): Promise<Book> {
    const response = await axios.get<Book>(`${BookService.path}/${id}`);
    return toBook(response.data);
  }
}
