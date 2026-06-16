export const catalog = {
    1: {
        name: "30 Day Ab Challenge",
        price: 150,
        // Object key in the "products" Netlify Blobs store (and the filename
        // the customer receives as an attachment).
        file: "30-day-ab-challenge.pdf",
    },
};

export function priceCart(ids) {
    const items = [];
    for (const rawId of ids || []) {
        const product = catalog[rawId];
        if (product) {
            items.push({ id: String(rawId), name: product.name, price: product.price });
        }
    }
    if (items.length === 0) {
        throw new Error("No valid products in cart");
    }
    const total = items.reduce((sum, item) => sum + item.price, 0);
    return { items, total };
}

export function filesFor(ids) {
    return (ids || [])
        .map((id) => catalog[id])
        .filter((product) => product && product.file)
        .map((product) => ({ name: product.name, file: product.file }));
}
