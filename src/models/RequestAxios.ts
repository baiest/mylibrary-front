export interface RequestAxios<T> {
  loading: boolean;
  error: string | null;
  data: T;
}
