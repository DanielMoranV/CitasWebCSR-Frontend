export default class NodeService {
    getTreeTableNodes() {
        return fetch('media/data/treetablenodes.json')
            .then((res) => res.json())
            .then((d) => d.root);
    }

    getTreeNodes() {
        return fetch('media/data/treenodes.json')
            .then((res) => res.json())
            .then((d) => d.root);
    }
}
