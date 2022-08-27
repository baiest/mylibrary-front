import type { Book, BookCreate } from "@/models/Book";
import axios from "./axios";

export class BookService {
  static path = "/books";

  static async getAll(): Promise<Book[]> {
    const response = await axios.get<Book[]>(BookService.path);
    return response.data;
  }

  static async create(data: BookCreate) {
    await axios.post(BookService.path, data);
  }
}
