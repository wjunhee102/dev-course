import Breadcrumb from "./components/Breadcrumb.js";
import { request } from "./utils/api.js";

const cache = {};
export default class App {
  constructor($app) {
    this.state = {
      isRoot: true,
      nodes: [],
      depth: [],
      selectedFilePath: null,
      isLoading: true,
    };
    this.breadcrumb = new Breadcrumb({ $app, initialState: this.state.depth });
    this.init();
  }
  setState(nextState) {
    this.state = nextState;
    this.breadcrumb.setState(this.state.depth);
    // this.nodes.setState({
    //   isRoot: this.state.isRoot,
    //   nodes: this.state.nodes,
    // });
    // this.imageView.setState(this.state.selectedFilePath);
    // this.loading.setState(this.state.isLoading);
  }
  async init() {
    try {
      const rootNodes = await request();
      this.setState({
        ...this.state,
        isRoot: true,
        nodes: rootNodes,
        isLoading: false,
      });
      // 캐시에 추가
      cache.root = rootNodes;
    } catch (e) {
      console.log(e);
      throw new Error(`무언가 잘못 되었습니다! ${e.message}`);
    }
  }
}
