export interface RequestAPI<T> {
  loading: boolean;
  error: string | null;
  data: T;
}
