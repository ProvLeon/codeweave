declare module 'piston-client' {
  export class Piston {
    execute(language: string, code: string): Promise<{ run: { output: string } }>;
  }
}
