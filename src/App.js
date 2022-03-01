import Breadcrumb from "./components/Breadcrumb.js";
import ImageView from "./components/ImageView.js";
import Loading from "./components/Loading.js";
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
    this.breadcrumb = new Breadcrumb({
      $app,
      initialState: this.state.depth,
      onClick: (index) => this.clickPath(index),
    });
    this.nodes = new Nodes({
      $app,
      initialState: {
        isRoot: this.state.isRoot,
        nodes: this.state.nodes,
      },
      onClick: (node) => this.clickNode(node),
      onBackClick: () => this.backClick(),
    });
    this.loading = new Loading({ $app, initialState: this.state.isLoading });
    this.imageView = new ImageView({
      $app,
      initialState: this.state.selectedNodeImage,
      onClose: () => this.closeImageView(),
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
    this.loading.setState(this.state.isLoading);
    this.imageView.setState(this.state.selectedFilePath);
  }
  closeImageView() {
    this.setState({
      ...this.state,
      selectedFilePath: null,
    });
  }
  clickPath(index) {
    if (index === null) {
      this.setState({
        ...this.state,
        depth: [],
        nodes: cache.root,
        isRoot: true,
      });
      return;
    }

    const nextState = { ...this.state };
    const nextDepth = this.state.depth.slice(0, index + 1);
    this.setState({
      ...nextState,
      depth: nextDepth,
      nodes: cache[nextDepth[nextDepth.length - 1].id],
    });
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

  backClick() {
    try {
      const nextState = { ...this.state };
      nextState.depth.pop();
      const prevNodeId =
        nextState.depth.length === 0
          ? null
          : nextState.depth[nextState.depth.length - 1].id;

      if (prevNodeId === null) {
        this.setState({
          ...nextState,
          isRoot: true,
          nodes: cache.root,
        });
      } else {
        this.setState({
          ...nextState,
          isRoot: false,
          nodes: cache[prevNodeId],
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
      cache.root = rootNodes;
    } catch (e) {
      console.log(e);
      throw new Error(`무언가 잘못 되었습니다! ${e.message}`);
    }
  }
}
