export const catalog = {
    1: {
        name: "30 Day Ab Challenge",
        price: 150,
        downloadUrl: process.env.PRODUCT_30_DAY_AB_CHALLENGE_URL,
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

export function downloadLinksFor(ids) {
    return (ids || [])
        .map((id) => catalog[id])
        .filter((product) => product && product.downloadUrl)
        .map((product) => ({ name: product.name, url: product.downloadUrl }));
}
