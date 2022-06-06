import Vue from "vue";
import Vuex, { Store } from "vuex";

Vue.use(Vuex);

const store: Store<unknown> = new Vuex.Store({});
export default store;

interface Modules {
  [index: string]: any;
}

function getModules(): Modules {
  const folder: __WebpackModuleApi.RequireContext = getFolder();
  return Object.fromEntries(getModulesArr());

  function getFolder(): __WebpackModuleApi.RequireContext {
    return require.context("./modules", true, /.js$/);
  }
  function getModulesArr(): [string, any][] {
    return folder.keys().map((key) => getKeyValPairArr(key));

    function getKeyValPairArr(key: string): [string, any] {
      const moduleName: string = key.substring(2, key.length - 3);
      const module: any = folder(key).default;
      return [moduleName, module];
    }
  }
}

const modules: Modules = getModules();

for (const key in modules) {
  store.registerModule(key, modules[key]);
}

