"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { addLine, makeLine, type CartLine, type Product, type Selection } from "@/lib/commerce";
import { getProduct } from "@/data/catalogue";
import { getSupabase } from "@/lib/supabase";
import { Check, X } from "lucide-react";

type Store = {
  lines: CartLine[];
  ready: boolean;
  user: User | null;
  authReady: boolean;
  add: (product: Product, selection: Selection, quantity: number, customization?: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  notify: (message: string) => void;
};
const StoreContext = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
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
    const supabase = getSupabase();
    if (!supabase) { setAuthReady(true); return; }
    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (active) { setUser(error ? null : data.session?.user ?? null); setAuthReady(true); }
    }).catch(() => { if (active) setAuthReady(true); });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) { setUser(session?.user ?? null); setAuthReady(true); }
    });
    return () => { active = false; subscription.subscription.unsubscribe(); };
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
  return <StoreContext.Provider value={{ lines, ready, user, authReady, add, notify, updateQuantity: (key, quantity) => setLines(current => current.map(line => line.key === key ? { ...line, quantity: Math.max(1, Math.min(999, quantity)) } : line)), remove: key => setLines(current => current.filter(line => line.key !== key)) }}>
    {children}
    {toast && <div className="toast" role="status"><Check size={18} /><span>{toast}</span><button aria-label="Dismiss notification" onClick={() => setToast("")}><X size={16} /></button></div>}
  </StoreContext.Provider>;
}
export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("StoreProvider is required");
  return store;
}