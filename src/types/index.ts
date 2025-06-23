export type TUseState<T> = React.Dispatch<React.SetStateAction<T>>;

export interface IErrorPage {
  error: Error & { digest?: string };
  reset: () => void;
}
