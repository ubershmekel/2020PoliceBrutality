import jsonp from 'jsonp';

// Look at all these things I tried to use and failed,
// So I wrote an embedder from scratch, again.
// import oEmbed from 'oembed-all';
// import EmbedJS from 'embed-js'
// import twitter from 'embed-plugin-twitter'
// import url from 'embed-plugin-url'
// import emoji from 'embed-plugin-emoji'
// import { unfurl } from 'unfurl.js'


async function redditEmbed(link: HTMLAnchorElement) {
  return `<blockquote class="reddit-card" data-card-created="1591095929"><a href="${link.href}">asdf</a></blockquote>
  <script async src="//embed.redditmedia.com/widgets/platform.js" charset="UTF-8"></script>`
}

const domainToEmbedder: {[dom: string]: (link: HTMLAnchorElement) =>Promise<string> } = {
  "www.twitter.com": twitterJsonp,
  "twitter.com": twitterJsonp,
  "mobile.twitter.com": twitterJsonp,
  "www.reddit.com": redditEmbed,
}

async function jsonpOembed(embedUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    jsonp(embedUrl, undefined, (err: Error | null, data: any) => {
      if (err) {
        console.error("embed err", err.message);
        reject(err);
      } else {
        // console.log(data);
        console.log("oembed data", data);
        if (data.html) {
          return resolve(data.html);
        } else {
          reject(new Error("data did not have html in it to embed"));
        }
      }
    })
  });
}

async function twitterJsonp(link: HTMLAnchorElement) {
  const domain = "publish.twitter.com";
  const embedUrl = buildEmbedUrl(domain, link.href);
  return jsonpOembed(embedUrl);
}

function buildEmbedUrl(domain: string, url: string) {
  return `https://${domain}/oembed?url=${encodeURIComponent(url)}`;
}

async function defaultEmbedder(link: HTMLAnchorElement) {
  const domain = link.hostname;
  const embedUrl = buildEmbedUrl(domain, link.href);
  const html = await jsonpOembed(embedUrl);
  return html;
}

export async function myOembed(link: HTMLAnchorElement) {
  let domain = link.hostname;
  let html = '';
  if (domain in domainToEmbedder) {
    html = await domainToEmbedder[domain](link);
  } else {
    html = await defaultEmbedder(link);
  }

  if (!html) {
    throw new Error("Failed to get html for this one: " + link.href);
  }
  if (!link.parentElement) {
    throw new Error("This link element does not have a parent element, odd");
  }
  const embedInTo = link.parentElement;

  const embedNode = document.createElement('div');
  embedNode.innerHTML = html;
  embedInTo.appendChild(embedNode);
  embedNode.className = "embedded";
  nodeScriptReplace(link.parentElement);

}

function nodeScriptReplace(node: HTMLElement | null) {
  // https://stackoverflow.com/questions/1197575/can-scripts-be-inserted-with-innerhtml
  if(!node) {
    throw new Error("You tried to fix scripts on a nullish node");
  }
  if (nodeScriptIs(node) === true && node.parentNode) {
    node.parentNode.replaceChild(nodeScriptClone(node), node);
  }
  else {
    var i = 0;
    var children = node.childNodes;
    while (i < children.length) {
      nodeScriptReplace(children[i++] as HTMLElement);
    }
  }

  return node;
}
function nodeScriptIs(node: HTMLScriptElement | ChildNode) {
  return 'tagName' in node && node.tagName === 'SCRIPT';
}
function nodeScriptClone(node: HTMLElement) {
  var script = document.createElement("script");
  script.text = node.innerHTML;
  for (var i = node.attributes.length - 1; i >= 0; i--) {
    script.setAttribute(node.attributes[i].name, node.attributes[i].value);
  }
  return script;
}