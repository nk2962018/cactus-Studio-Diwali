"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { addLine, makeLine, type CartLine, type Product, type Selection, validOrderQuantity } from "@/lib/commerce";
import { getProduct } from "@/data/catalogue";
import { Check, X } from "lucide-react";

type Store = {
  lines: CartLine[];
  ready: boolean;
  add: (product: Product, selection: Selection, quantity: number, customization?: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  notify: (message: string) => void;
};
const StoreContext = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem("cactus-cart-v1") || "[]");
      if (Array.isArray(saved)) {
        const restored = saved.flatMap(value => {
          try {
            if (!value || typeof value !== "object") return [];
            const product = getProduct(value.productId);
            return product ? [makeLine(product, value.variants, value.quantity, typeof value.customization === "string" ? value.customization : "")] : [];
          } catch { return []; }
        });
        setLines(restored.reduce(addLine, []));
      }
    } catch { setLines([]); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) {
      try { localStorage.setItem("cactus-cart-v1", JSON.stringify(lines)); }
      catch { setToast("Your bag is available for this visit, but browser storage is unavailable."); }
    }
  }, [lines, ready]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  function notify(message: string) {
    setToast(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 4200);
  }
  function add(product: Product, selection: Selection, quantity: number, customization = "") {
    const incoming = makeLine(product, selection, quantity, customization);
    setLines(current => addLine(current, incoming));
    notify(`${product.name} added to your bag`);
  }
  function updateQuantity(key: string, quantity: number) {
    setLines(current => current.flatMap(line => {
      if (line.key !== key) return [line];
      const product = getProduct(line.productId);
      if (!product || !validOrderQuantity(product, quantity)) return [line];
      try { return [makeLine(product, line.variants, quantity, line.customization)]; }
      catch { return [line]; }
    }).reduce(addLine, []));
  }
  return <StoreContext.Provider value={{ lines, ready, add, notify, updateQuantity, remove: key => setLines(current => current.filter(line => line.key !== key)) }}>
    {children}
    {toast && <div className="toast" role="status"><Check size={18} /><span>{toast}</span><button aria-label="Dismiss notification" onClick={() => setToast("")}><X size={16} /></button></div>}
  </StoreContext.Provider>;
}
export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("StoreProvider is required");
  return store;
}