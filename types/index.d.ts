// TypeScript Version: 3.0

declare module 'split-string' {
  function split(input: string, options?: split.Options | split.SplitFunc): string[];
  function split(input: string, options: split.Options, fn: split.SplitFunc): string[];

  namespace split {
    interface ASTNode {
      type: 'root' | 'bracket';
      nodes: ASTNode[];
      stash: string[];
    }

    interface State {
      input: string;
      separator: string;
      stack: ASTNode[];

      bos(): boolean;

      eos(): boolean;

      prev(): string;

      next(): string;
    }

    interface Options {
      brackets?: { [key: string]: string } | boolean;
      quotes?: string[] | boolean;
      separator?: string;
      strict?: boolean;

      keep?(value: string, state: State): boolean;
    }

    type SplitFunc = (state: State) => boolean;
  }

  export = split;
}
