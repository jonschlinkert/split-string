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

declare function split(input: string): string[];
declare function split(input: string, options: Options): string[];
declare function split(input: string, fn: SplitFunc): string[];
declare function split(input: string, options: Options, fn: SplitFunc): string[];

export default split;
