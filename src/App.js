import Breadcrumb from "./components/Breadcrumb.js";
import Nodes from "./components/Nodes.js";
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
    this.nodes = new Nodes({
      $app,
      initialState: {
        isRoot: this.state.isRoot,
        nodes: this.state.nodes,
      },
      onClick: (node) => this.clickNode(node),
    });
    this.init();
  }
  setState(nextState) {
    this.state = nextState;
    this.breadcrumb.setState(this.state.depth);
    this.nodes.setState({
      isRoot: this.state.isRoot,
      nodes: this.state.nodes,
    });
    // this.imageView.setState(this.state.selectedFilePath);
    // this.loading.setState(this.state.isLoading);
  }
  async clickNode(node) {
    try {
      if (node.type === "DIRECTORY") {
        this.setState({
          ...this.state,
          isLoading: true,
        });
        if (cache[node.id]) {
          this.setState({
            ...this.state,
            depth: [...this.state.depth, node],
            nodes: cache[node.id],
            isLoading: false,
            isRoot: false,
          });
        } else {
          const nextNodes = await request(node.id);
          this.setState({
            ...this.state,
            depth: [...this.state.depth, node],
            nodes: nextNodes,
            isLoading: false,
            isRoot: false,
          });
          cache[node.id] = nextNodes;
        }
      } else if (node.type === "FILE") {
        this.setState({
          ...this.state,
          selectedFilePath: node.filePath,
        });
      }
    } catch (e) {}
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
