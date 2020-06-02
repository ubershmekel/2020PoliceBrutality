import Vue from "vue";
import axios from "axios";
import {compileToFunctions} from 'vue-template-compiler';
import { TreeRootObject, Tree, FileRootObject } from "../types/github-types";
import VueMarkdown from 'vue-markdown';


export default Vue.extend({
  // Parcel 2 does not yet support vue single file components
  // so `compileToFunctions` is the workaround.
  ...compileToFunctions(`
    <div>
      What
      {{ files }}
      ...
      {{ message }}
      ---
      <ul>
        <li v-for="item in states()">
          <button @click="showItem(item)">{{ item.path }}</button>
        </li>
      </ul>

      <div class="view">
        <vue-markdown :source="viewing"></vue-markdown>
      </div>
    </div>
  `),
  data() {
    return {
      files: [],
      message: "hi dude",
      tree: [],
      viewing: '',
    };
  },

  components: {
    'vue-markdown': VueMarkdown,
  },

  methods: {
    states() {
      console.log("this tree", this.tree);
      const result = [];
      const ignores = ["README.md", "CONTRIBUTING.md"];
      for (const item of this.tree) {
        if (ignores.includes(item.path)) {
          continue;
        }
        result.push(item);
      }
      return result;
    },
    async showItem(item: Tree) {
      console.log("item", item);
      const res = await axios.get(item.url);
      const data: FileRootObject = res.data;
      this.viewing = atob(data.content);
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
    this.tree = treeRoot.tree;
  }
});
