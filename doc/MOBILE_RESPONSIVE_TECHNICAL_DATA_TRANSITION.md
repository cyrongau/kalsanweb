1. Mobile-Responsive Design

Mobile Shop View: The desktop grid translates into a touch-friendly single or double-column layout. Filters are tucked into a bottom-sheet drawer to maximize screen real estate for product browsing.
Mobile Quote & Payment View: This screen ensures that even on the go, users can review prices and complete payments easily. The "Pay" action is docked at the bottom for thumb-friendly interaction.

2. Technical Database Schema: Quote-to-Order Transition

For the engineer, the most critical part of this app is the Relational Mapping and the Status State Machine. Here is the recommended data structure:

Core Tables
users: id, email, password_hash, role_id, garage_details (jsonb)
products: id, sku, brand_id, category_id, description, image_urls (array), stock_status

quotes:

id, user_id, status (pending, reviewing, price_ready, expired, converted)
created_at, expires_at (very important for price volatility)
admin_notes, total_amount (nullable until price_ready)
quote_items: id, quote_id, product_id, quantity, unit_price (nullable)

orders:

id, quote_id (fk), user_id, payment_intent_id, total_paid
status (paid, processing, shipped, delivered)
tracking_number, invoice_url
Transition Logic (The "Order" Conversion)
Inquiry Phase: Create entry in quotes and multiple entries in quote_items with unit_price as NULL.
Valuation Phase: Admin updates quote_items.unit_price and sets quotes.status = 'price_ready'.
Payment Phase: When the user pays, a new record is created in orders. Important: The engineer should snapshot the quote_items into an order_items table or keep the quote immutable to ensure the price doesn't change after payment.
Cleanup: Set quotes.status = 'converted'.

3. API Requirements

GET /api/products: Support filters for brand, model, and category.
POST /api/quotes: Create a new inquiry.
PATCH /api/admin/quotes/:id: For admins to add prices.
POST /api/checkout/:quote_id: To trigger the payment gateway and create the order.