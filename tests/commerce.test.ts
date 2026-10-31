import { test } from "node:test";
import assert from "node:assert/strict";
import { addLine, cartTotal, defaults, hasContactPricing, makeLine, normalizeIndianPhone, orderMessage, priceFor, validOrderQuantity, validateDelivery, whatsappUrl, type Product } from "../src/lib/commerce";

const product: Product = { id: "gift", name: "Gift Box", category: "Curated Gifts", productType: "gift", pricingType: "fixed", description: "Thoughtful gift", detail: "", images: [], available: true, basePrice: 299, variants: [{ id: "size", label: "Size", options: [{ value: "2", label: "Small", adjustment: 0 }, { value: "3", label: "Medium", adjustment: 200 }, { value: "4", label: "Large", adjustment: 400 }] }] };
const delivery = { name: "Nisha", phone: "9876543210", email: "nisha@example.com", address: "12 Garden Road, Pune" , landmark: "", pincode: "411001", instructions: "" };
test("variant prices and defaults are derived from catalogue", () => {
  assert.deepEqual(defaults(product), { size: "2" });
  assert.equal(priceFor(product, { size: "3" }), 499);
  assert.throws(() => priceFor(product, { size: "unknown" }));
});
test("separate configurations stay separate, matching configurations merge", () => {
  let lines = addLine([], makeLine(product, { size: "2" }, 1));
  lines = addLine(lines, makeLine(product, { size: "4" }, 2));
  lines = addLine(lines, makeLine(product, { size: "2" }, 2));
  assert.equal(lines.length, 2);
  assert.equal(lines[0].quantity, 3);
  assert.equal(cartTotal(lines), 2295);
  assert.equal(cartTotal(lines.filter(line => line.variants.size !== "4")), 897);
  assert.equal(cartTotal([]), 0);
});
test("order includes variants, quantities, delivery, prices and encoded business destination", () => {
  const details = { ...delivery, address: "123 Example Street\nBangalore\nKarnataka", address2: "560001" };
  const message = orderMessage(details, [makeLine(product, { size: "3" }, 2)]);
  assert.match(message, /Size: Medium/);
  assert.match(message, /Quantity: 2/);
  assert.match(message, /998/);
  assert.match(message, /nisha@example.com/);
  assert.match(message, /123 Example Street\nBangalore\nKarnataka\n560001/);
  assert.ok(whatsappUrl(message).startsWith("https://wa.me/919966998768?text="));
  assert.throws(() => orderMessage(delivery, []));
});
test("delivery validation rejects incomplete and invalid fields", () => {
  assert.equal(validateDelivery(delivery), null);
  for (const change of [{ name: "" }, { phone: "123" }, { email: "bad" }, { address: "x" }, { pincode: "000000" }]) assert.ok(validateDelivery({ ...delivery, ...change }));
});
test("custom notes are separate and invalid quantities are rejected", () => {
  assert.notEqual(makeLine(product, { size: "2" }, 1, "A").key, makeLine(product, { size: "2" }, 1, "B").key);
  for (const quantity of [0, -1, 1.5, 10000]) assert.throws(() => makeLine(product, { size: "2" }, quantity));
});
test("cart uses the supplied thumbnail with a product-image fallback", () => {
  assert.equal(makeLine({ ...product, images: ["/product.png"], cartImage: "/thumbnail.png" }, { size: "2" }, 1).image, "/thumbnail.png");
  assert.equal(makeLine({ ...product, images: ["/product.png"] }, { size: "2" }, 1).image, "/product.png");
});
test("plants are contact-priced and require at least 50 units", () => {
  const plant: Product = { ...product, id: "plant", name: "Jade Plant", category: "Plants", productType: "plant", pricingType: "contact", bulkOnly: true, minimumQuantity: 50, basePrice: undefined };
  assert.equal(validOrderQuantity(plant, 49), false);
  assert.equal(validOrderQuantity(plant, 50), true);
  const line = makeLine(plant, { size: "2" }, 50);
  assert.equal(line.totalPrice, null);
  assert.equal(hasContactPricing([line]), true);
  assert.equal(validOrderQuantity(plant, 100), true);
  assert.throws(() => makeLine(plant, { size: "2" }, 49), /Plants are available for bulk orders only\. Minimum order quantity is 50\./);
  assert.throws(() => priceFor(plant, { size: "2" }), /priced on request/);
  const invalidLine = { ...line, quantity: 49 };
  assert.throws(() => orderMessage(delivery, [invalidLine]), /Plants are available for bulk orders only\. Minimum order quantity is 50\./);
});
test("candle and tealight quantities reject gaps below custom minimum", () => {
  const candle: Product = { ...product, id: "candle", name: "Flower Candle", productType: "candle", pricingType: "collection", minimumQuantity: 6, minimumCustomQuantity: 24, availableCollections: [6, 12], collectionPrices: { 6: 399, 12: 699, 24: 1199, 50: 2199 } };
  for (const quantity of [6, 12, 24, 30, 49, 50]) assert.equal(validOrderQuantity(candle, quantity), true);
  for (const quantity of [1, 5, 7, 18, 23]) assert.equal(validOrderQuantity(candle, quantity), false);
  assert.equal(makeLine(candle, { size: "2" }, 6).totalPrice, 399);
  assert.equal(makeLine(candle, { size: "2" }, 12).totalPrice, 699);
  assert.equal(makeLine(candle, { size: "2" }, 30).totalPrice, null);
  const invalidCustom = { ...makeLine(candle, { size: "2" }, 24), quantity: 23 };
  assert.throws(() => orderMessage(delivery, [invalidCustom]), /Custom quantities must be 24 pieces or more\./);
  const invalidBulk = { ...makeLine(candle, { size: "2" }, 50), quantity: 49 };
  assert.throws(() => orderMessage(delivery, [invalidBulk]), /Bulk orders start at 50 pieces\./);
});
test("WhatsApp order includes selected candle color and collection size", () => {
  const candle: Product = { ...product, id: "flower-candle", name: "Flower Candle", productType: "candle", pricingType: "collection", minimumQuantity: 6, minimumCustomQuantity: 24, collectionPrices: { 6: 399 }, variants: [{ id: "color", label: "Preferred color", options: [{ value: "rose", label: "Rose preferred", adjustment: 0 }] }] };
  const message = orderMessage(delivery, [makeLine(candle, { color: "rose" }, 6)]);
  assert.match(message, /Preferred color: Rose preferred/);
  assert.match(message, /Collection: 6 pieces/);
  assert.match(message, /Quantity: 6 pieces/);
  assert.match(message, /Order Type: Regular/);
});
test("guest phone normalization and WhatsApp message include order terms", () => {
  assert.equal(normalizeIndianPhone("+91 98765-43210"), "+919876543210");
  assert.equal(normalizeIndianPhone("1234567890"), "");
  const plant: Product = { ...product, id: "plant", name: "Jade Plant", category: "Plants", productType: "plant", pricingType: "contact", bulkOnly: true, minimumQuantity: 50, basePrice: undefined };
  const message = orderMessage(delivery, [makeLine(plant, { size: "2" }, 50)]);
  assert.match(message, /Order Type: Bulk/);
  assert.match(message, /40% security amount/);
  assert.match(message, /Bulk pricing will be shared on WhatsApp/);
  assert.match(message, /Phone: \+919876543210/);
  assert.doesNotMatch(message, /₹0/);
});