# FECTO — zero-cost starter store

This is a working front-end e-commerce starter for FECTO.

## What already works
- Responsive fashion storefront
- Product catalog
- Category filters
- Add to cart
- Quantity controls
- Checkout form on the website
- Order ID generation
- Local cart persistence
- Mobile layout

## Make real orders appear in your own order sheet (free)
The included `google-apps-script.js` lets you use Google Sheets as a simple free order database.

1. Create a blank Google Sheet.
2. Open **Extensions → Apps Script**.
3. Paste the contents of `google-apps-script.js`.
4. Save it.
5. Deploy → New deployment → Web app.
6. Set **Execute as: Me** and **Who has access: Anyone**.
7. Copy the `/exec` URL.
8. Open `app.js` and replace:
   `const ORDER_ENDPOINT = "";`
   with:
   `const ORDER_ENDPOINT = "YOUR_EXEC_URL";`
9. Upload the updated files to your free hosting.

## Free hosting
You can host these static files on a free static-hosting service such as GitHub Pages or Cloudflare Pages.

## Payments
The checkout currently supports COD as a real order option. The "Online payment" choice is a placeholder. A payment gateway normally charges transaction fees, so it cannot honestly be promised as a completely free part of the store. Once FECTO is ready to take online payments, connect an Indian payment gateway to the checkout.

## Products
Edit `products.js` to change product names, prices, colors and tags.

## Important before launch
Replace the placeholder product visuals with real FECTO product photography, add your final size chart, shipping/return policies, contact details and legal pages.
