import jsonp from 'jsonp';

// Look at all these things I tried to use and failed,
// So I wrote an embedder from scratch, again.
// import oEmbed from 'oembed-all';
// import EmbedJS from 'embed-js'
// import twitter from 'embed-plugin-twitter'
// import url from 'embed-plugin-url'
// import emoji from 'embed-plugin-emoji'
// import { unfurl } from 'unfurl.js'


function redditEmbed(url: string) {
  return `<blockquote class="reddit-card" data-card-created="1591095929"><a href="${url}">asdf</a></blockquote>
  <script async src="//embed.redditmedia.com/widgets/platform.js" charset="UTF-8"></script>`
}

export async function myOembed(link: HTMLAnchorElement) {
  let domain = link.hostname;
  if (domain === "www.twitter.com" || domain === "twitter.com" || domain === "mobile.twitter.com") {
    domain = "publish.twitter.com";
  }
  const embedUrl = `https://${domain}/oembed?url=${encodeURIComponent(link.href)}`;
  if (!link.parentElement) {
    throw new Error("This link element does not have a parent element, odd");
  }
  const embedInTo = link.parentElement;
  if (domain === "www.reddit.com") {
    const embedNode = document.createElement('div');
    embedNode.innerHTML = redditEmbed(link.href);
    embedInTo.appendChild(embedNode);
    nodeScriptReplace(link.parentElement);
    return;
  }
  jsonp(embedUrl, undefined, (err: Error | null, data: any) => {
    if (err) {
      console.error("embed err", err.message);
      // this.handleError(err);
      throw err;
    } else {
      // console.log(data);
      console.log("oembed data", data);
      if (data.html) {
        const embedNode = document.createElement('div');
        embedNode.innerHTML = data.html;
        embedInTo.appendChild(embedNode);
        nodeScriptReplace(link.parentElement);
        // while (temp.firstChild) {
        //   target.appendChild(temp.firstChild);
        // }
      }
    }
  })
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