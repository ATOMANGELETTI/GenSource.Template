export interface AppInfo {
  name: string;
  version: string;
  description?: string;
}

/** Matches `commands::greet` which returns a bare `String`. */
export type GreetResponse = string;

export interface GreetArgs {
  name: string;
}
