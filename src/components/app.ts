import Vue from "vue";
import axios from "axios";
import { compileToFunctions } from 'vue-template-compiler';
import { TreeRootObject, Tree, FileRootObject } from "../../types/github-types";
import VueMarkdown from 'vue-markdown';

import { myOembed } from '../embed';


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

      <div class="error-text" v-if="errorText">
        {{ errorText }}
      </div>

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
      statesList: [] as Tree[],
      stateMarkdown: '',
      activeStateName: '',
      editLink: '',
      errorText: '',
    };
  },

  components: {
    'vue-markdown': VueMarkdown,
  },

  methods: {
    handleError(err: Error) {
      const pretext = 'Got some sort of error. Feel free to open a github issue and tag @ubershmekel. Please include as much information as possible. Error: ';
      let summary = '';
      if (err && err.message) {
        summary = err.message;
      } else {
        summary = JSON.stringify(err);
      }
      
      this.errorText = pretext + summary;
    },

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
      let res;
      try {
        res = await axios.get(item.url);
        if (!res) {
          throw new Error("axios returned nothing");
        }
      } catch (err) {
        this.handleError(err);
        return;
      }
      const data: FileRootObject = res.data;
      this.stateMarkdown = atob(data.content);

      this.$nextTick(async function () {
        // Code that will run only after the
        // entire view has been re-rendered

        const linksList = [...document.querySelectorAll('#md-view a')] as HTMLAnchorElement[];
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
    let res;
    try {
      res = await axios.get(listUrl);
      if (!res) {
        throw new Error("axios returned nothing listUrl");
      }
    } catch (err) {
      this.handleError(err);
      return;
    }

    const treeRoot: TreeRootObject = res.data;
    this.statesList = treeRoot.tree;
  }
});
