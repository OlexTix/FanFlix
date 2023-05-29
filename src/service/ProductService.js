// import ProductService z odpowiednimi importami

export const ProductService = {
    getProducts() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const products = [
                    {
                        id: '1',
                        name: 'Product 1',
                        price: 10.99,
                        inventoryStatus: 'INSTOCK'
                    },
                    {
                        id: '2',
                        name: 'Product 2',
                        price: 19.99,
                        inventoryStatus: 'LOWSTOCK'
                    },
                    {
                        id: '3',
                        name: 'Product 3',
                        price: 5.99,
                        inventoryStatus: 'OUTOFSTOCK'
                    },
                    // Dodaj więcej produktów według potrzeb
                ];

                resolve(products);
            }, 1000); // Symulacja opóźnienia pobierania danych
        });
    }
};