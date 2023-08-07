export default class ProductService {
    getProductsSmall() {
        return fetch('media/data/products-small.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getProducts() {
        return fetch('media/data/products.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getProductsWithOrdersSmall() {
        return fetch('media/data/products-orders-small.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
