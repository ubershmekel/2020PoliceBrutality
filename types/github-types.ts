/*
Example Tree
{
  "path": "California.md",
  "mode": "100644",
  "type": "blob",
  "sha": "20b1c807208a182be6f907bd5c9c689806e1deda",
  "size": 2955,
  "url": "https://api.github.com/repos/2020PB/police-brutality/git/blobs/20b1c807208a182be6f907bd5c9c689806e1deda"
}
*/
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