import Vue from "vue";
import axios from "axios";
import { compileToFunctions } from 'vue-template-compiler';
import { TreeRootObject, Tree, FileRootObject } from "../types/github-types";
import VueMarkdown from 'vue-markdown';
import jsonp from 'jsonp';


// import oEmbed from 'oembed-all';
// import EmbedJS from 'embed-js'
// import twitter from 'embed-plugin-twitter'
// import url from 'embed-plugin-url'
// import emoji from 'embed-plugin-emoji'
// import { unfurl } from 'unfurl.js'

function nodeScriptReplace(node) {
  if (nodeScriptIs(node) === true) {
    node.parentNode.replaceChild(nodeScriptClone(node), node);
  }
  else {
    var i = 0;
    var children = node.childNodes;
    while (i < children.length) {
      nodeScriptReplace(children[i++]);
    }
  }

  return node;
}
function nodeScriptIs(node) {
  return node.tagName === 'SCRIPT';
}
function nodeScriptClone(node) {
  var script = document.createElement("script");
  script.text = node.innerHTML;
  for (var i = node.attributes.length - 1; i >= 0; i--) {
    script.setAttribute(node.attributes[i].name, node.attributes[i].value);
  }
  return script;
}

function redditEmbed(url) {
  return `<blockquote class="reddit-card" data-card-created="1591095929"><a href="${url}">asdf</a></blockquote>
  <script async src="//embed.redditmedia.com/widgets/platform.js" charset="UTF-8"></script>`
}

async function myOembed(link) {
  let domain = link.hostname;
  if (domain === "www.twitter.com" || domain === "twitter.com" || domain === "mobile.twitter.com") {
    domain = "publish.twitter.com";
  }
  const embedUrl = `https://${domain}/oembed?url=${encodeURIComponent(link.href)}`;
  if (domain === "www.reddit.com") {
    // const data: any = await axios.get(embedUrl);
    const embedNode = document.createElement('div');
    embedNode.innerHTML = redditEmbed(link.href);
    // embedNode.innerHTML = data.html;
    link.parentElement.appendChild(embedNode);
    nodeScriptReplace(link.parentElement);
    return;
  }
  jsonp(embedUrl, null, (err, data) => {
    if (err) {
      console.error("embed err", err.message);
    } else {
      // console.log(data);
      console.log("oembed data", data);
      if (data.html) {
        const embedNode = document.createElement('div');
        embedNode.innerHTML = data.html;
        link.parentElement.appendChild(embedNode);
        nodeScriptReplace(link.parentElement);
        // while (temp.firstChild) {
        //   target.appendChild(temp.firstChild);
        // }
      }
    }
  })
}

export default Vue.extend({
  // Parcel 2 does not yet support vue single file components
  // so `compileToFunctions` is the workaround.
  ...compileToFunctions(`
    <div>
      <ul>
        <li v-for="item in states()">
          <button @click="showItem(item)">{{ item.path.replace(".md", "") }}</button>
        </li>
      </ul>

      <h1 v-if="editLink">
        Edit this page at <a :href="editLink">{{ activeStateName }}</a>
      </h1>

      <div id="md-view">
        <vue-markdown :source="stateMarkdown"></vue-markdown>
      </div>
    </div>
  `),
  data() {
    return {
      statesList: [],
      stateMarkdown: '',
      activeStateName: '',
      editLink: '',
    };
  },

  components: {
    'vue-markdown': VueMarkdown,
  },

  methods: {
    states() {
      // console.log("this tree", this.tree);
      const result = [];
      const ignores = ["README.md", "CONTRIBUTING.md"];
      for (const item of this.statesList) {
        if (ignores.includes(item.path)) {
          continue;
        }
        result.push(item);
      }
      return result;
    },

    async showItem(item: Tree) {
      // Show for any given state the posts
      // eg "https://github.com/2020PB/police-brutality/blob/master/Texas.md"
      this.editLink = `https://github.com/2020PB/police-brutality/blob/master/${item.path}`;
      this.activeStateName = item.path;
      console.log("item", item);
      const res = await axios.get(item.url);
      const data: FileRootObject = res.data;
      this.stateMarkdown = atob(data.content);

      this.$nextTick(async function () {
        // Code that will run only after the
        // entire view has been re-rendered

        const linksList = [...document.querySelectorAll('#md-view a')];
        for (const link of linksList) {
          myOembed(link);
        }
        
        
        // const options = {};
        // console.log("unfurl", link.href, await unfurl(link.href));
        // const embed = new oEmbed(link, options);
        // console.log("oembed", embed);

        // const emb = new EmbedJS({
        //   input: document.getElementById('md-view'),
        //   plugins: [
        //     // url(),
        //     // emoji(),
        //     twitter(),
        //   ]
        // })
        // emb.render();
      })


    }
  },

  async mounted() {
    // const url = 'https://api.coindesk.com/v1/bpi/currentprice.json';
    // const testUrl = 'https://api.embedly.com/1/oembed?url=https://twitter.com/etpartipredsct1/status/1266935860865298432&key=c07d04bbd5e24628a0fadb22a2c79d55';
    // const testData = await axios.get(testUrl);
    // this.message = testData;

    const listUrl = "https://api.github.com/repos/2020PB/police-brutality/git/trees/master";
    const res = await axios.get(listUrl);
    const treeRoot: TreeRootObject = res.data;
    this.statesList = treeRoot.tree;
  }
});
