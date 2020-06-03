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
  name: string;
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

///////////////////

export interface FileRootObject {
  sha: string;
  node_id: string;
  size: number;
  url: string;
  content: string;
  encoding: string;
}

////////////////////

export interface Links {
  self: string;
  git: string;
  html: string;
}
/*
[
  {
    "name": "Alabama.md",
    "path": "reports/Alabama.md",
    "sha": "6071ca962ef2e515f4d83f4ea606051699b61662",
    "size": 597,
    "url": "https://api.github.com/repos/2020PB/police-brutality/contents/reports/Alabama.md?ref=master",
    "html_url": "https://github.com/2020PB/police-brutality/blob/master/reports/Alabama.md",
    "git_url": "https://api.github.com/repos/2020PB/police-brutality/git/blobs/6071ca962ef2e515f4d83f4ea606051699b61662",
    "download_url": "https://raw.githubusercontent.com/2020PB/police-brutality/master/reports/Alabama.md",
    "type": "file",
    "_links": {
      "self": "https://api.github.com/repos/2020PB/police-brutality/contents/reports/Alabama.md?ref=master",
      "git": "https://api.github.com/repos/2020PB/police-brutality/git/blobs/6071ca962ef2e515f4d83f4ea606051699b61662",
      "html": "https://github.com/2020PB/police-brutality/blob/master/reports/Alabama.md"
    }
  },
]
*/

export interface ContentsObject {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  _links: Links;
}

export type ContentsRoot = ContentsObject[];