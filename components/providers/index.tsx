import { AuthProvider } from "./auth-provider";

export function Provider({ children }: any) {
  return <AuthProvider>{children}</AuthProvider>;
}
