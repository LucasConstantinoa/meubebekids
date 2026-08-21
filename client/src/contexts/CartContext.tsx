/**
 * Meu Bebê Kids — Contexto do Carrinho
 * Estilo "Nursery Soft" (ver ideas.md). Persistência em localStorage.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "@/lib/products";
import { trpc } from "@/lib/trpc";

export interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
}

export interface DeliveryInfo {
  nome: string;
  telefone: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  observacoes: string;
}

interface CartContextValue {
  items: CartItem[];
  delivery: DeliveryInfo;
  isOpen: boolean;
  setDelivery: (d: DeliveryInfo) => void;
  setOpen: (open: boolean) => void;
  addItem: (productId: string, size?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateItemSize: (productId: string, size: string) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  getProduct: (id: string) => Product | undefined;
  catalogProducts: Product[];
}

const CART_KEY = "meubebe-cart-v1";
const DELIVERY_KEY = "meubebe-delivery-v1";

const defaultDelivery: DeliveryInfo = {
  nome: "",
  telefone: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  cep: "",
  observacoes: "",
};

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    /* ignore */
  }
  return [];
}

function loadDelivery(): DeliveryInfo {
  try {
    const raw = localStorage.getItem(DELIVERY_KEY);
    if (!raw) return defaultDelivery;
    return { ...defaultDelivery, ...JSON.parse(raw) };
  } catch {
    return defaultDelivery;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [delivery, setDelivery] = useState<DeliveryInfo>(loadDelivery);
  const [isOpen, setOpen] = useState(false);
  const catalogQuery = trpc.catalog.list.useQuery();
  const catalogProducts = useMemo<Product[]>(() => {
    if (!catalogQuery.data?.length) return products;
    return catalogQuery.data.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.price,
      image: product.images[0]?.url ?? "",
      category: product.category as Product["category"],
      tags: product.tags,
      badge: product.badge ?? undefined,
      featured: product.featured,
      sizes: product.sizes.filter((size) => size.available).map((size) => size.size),
    }));
  }, [catalogQuery.data]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(DELIVERY_KEY, JSON.stringify(delivery));
  }, [delivery]);

  useEffect(() => {
    if (!catalogQuery.data) return;
    setItems((currentItems) => currentItems.flatMap((item) => {
      const product = catalogProducts.find((candidate) => candidate.id === item.productId);
      if (!product || product.sizes.length === 0) return [];
      return [{ ...item, size: product.sizes.includes(item.size ?? "") ? item.size : product.sizes[0] }];
    }));
  }, [catalogQuery.data, catalogProducts]);

  const addItem = useCallback((productId: string, size?: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? {
                ...i,
                quantity: i.quantity + 1,
                size: size ? size : (i.size ?? "Único"),
              }
            : i,
        );
      }
      return [...prev, { productId, quantity: 1, size: size ?? "Único" }];
    });
    setOpen(true);
  }, []);

  const updateItemSize = useCallback(
    (productId: string, size: string) => {
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId ? { ...i, size } : i,
        ),
      );
    },
    [],
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        setItems((prev) => prev.filter((i) => i.productId !== productId));
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId ? { ...i, quantity } : i,
        ),
      );
    },
    [],
  );

  const clearCart = useCallback(() => setItems([]), []);

  const getProduct = useCallback(
    (id: string) => catalogProducts.find((p) => p.id === id),
    [catalogProducts],
  );

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const total = items.reduce((sum, i) => {
      const p = catalogProducts.find((pp) => pp.id === i.productId);
      return sum + (p ? p.price * i.quantity : 0);
    }, 0);
    return {
      items,
      delivery,
      isOpen,
      setDelivery,
      setOpen,
      addItem,
      removeItem,
      updateQuantity,
      updateItemSize,
      clearCart,
      itemCount,
      total,
      getProduct,
      catalogProducts,
    };
  }, [items, delivery, isOpen, addItem, removeItem, updateQuantity, updateItemSize, clearCart, getProduct, catalogProducts]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
