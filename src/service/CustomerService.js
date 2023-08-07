export default class CustomerService {
    getCustomersSmall() {
        return fetch('media/data/customers-small.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getCustomersMedium() {
        return fetch('media/data/customers-medium.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getCustomersLarge() {
        return fetch('media/data/customers-large.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getCustomersXLarge() {
        return fetch('media/data/customers-xlarge.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getCustomers(params) {
        const queryParams = Object.keys(params)
            .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');
        return fetch('https://www.primefaces.org//media/data/customers?' + queryParams).then((res) => res.json());
    }
}
