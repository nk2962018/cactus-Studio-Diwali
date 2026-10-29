import { test } from "node:test";
import assert from "node:assert/strict";
import { addLine, cartTotal, defaults, makeLine, orderMessage, priceFor, validateDelivery, whatsappUrl, type Product } from "../src/lib/commerce";

const product: Product = { id: "jade", name: "Jade Plant", category: "Plants", description: "Living gift", detail: "", images: [], available: true, basePrice: 299, variants: [{ id: "size", label: "Pot size", options: [{ value: "2", label: "2 inch", adjustment: 0 }, { value: "3", label: "3 inch", adjustment: 200 }, { value: "4", label: "4 inch", adjustment: 400 }] }] };
const delivery = { name: "Nisha", phone: "+919876543210", email: "nisha@example.com", address: "12 Garden Road", city: "Pune", state: "Maharashtra", pincode: "411001" };
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
  const message = orderMessage(delivery, [makeLine(product, { size: "3" }, 2)]);
  assert.match(message, /Pot size: 3 inch/);
  assert.match(message, /Quantity: 2/);
  assert.match(message, /998/);
  assert.match(message, /nisha@example.com/);
  assert.match(message, /411001/);
  assert.ok(whatsappUrl(message).startsWith("https://wa.me/919966998768?text="));
  assert.throws(() => orderMessage(delivery, []));
});
test("delivery validation rejects incomplete and invalid fields", () => {
  assert.equal(validateDelivery(delivery), null);
  for (const change of [{ name: "" }, { phone: "123" }, { email: "bad" }, { address: "x" }, { city: "" }, { state: "" }, { pincode: "000000" }]) assert.ok(validateDelivery({ ...delivery, ...change }));
});
test("custom notes are separate and invalid quantities are rejected", () => {
  assert.notEqual(makeLine(product, { size: "2" }, 1, "A").key, makeLine(product, { size: "2" }, 1, "B").key);
  for (const quantity of [0, -1, 1.5, 1000]) assert.throws(() => makeLine(product, { size: "2" }, quantity));
});
test("cart uses the supplied thumbnail with a product-image fallback", () => {
  assert.equal(makeLine({ ...product, images: ["/product.png"], cartImage: "/thumbnail.png" }, { size: "2" }, 1).image, "/thumbnail.png");
  assert.equal(makeLine({ ...product, images: ["/product.png"] }, { size: "2" }, 1).image, "/product.png");
});