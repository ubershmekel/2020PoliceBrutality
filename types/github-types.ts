export interface Tree {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size: number;
  url: string;
}

export interface TreeRootObject {
  sha: string;
  url: string;
  tree: Tree[];
  truncated: boolean;
}

export interface FileRootObject {
  sha: string;
  node_id: string;
  size: number;
  url: string;
  content: string;
  encoding: string;
}