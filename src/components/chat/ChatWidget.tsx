"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, ShoppingCart, Loader2 } from "lucide-react";
import type { Product } from "@/types";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  text: string;
  products?: Product[];
}

const SUGGESTIONS = [
  "Under $50",
  "Men's clothing",
  "Top rated",
  "Jewelery gifts",
];

let nextId = 1;

function ChatProductCard({ item }: { item: Product }) {
  const { cart, setCart } = useStore();
  const inCart = cart.some((c) => c.id === item.id);

  const addToCart = () => {
    if (!inCart) setCart([...cart, item]);
  };

  return (
    <Card className="flex gap-2 overflow-hidden p-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.image} alt={item.title} className="h-14 w-14 shrink-0 rounded object-contain" loading="lazy" />
      <div className="min-w-0 flex-1">
        <Link href={`/product/${item.id}`} className="block truncate text-xs font-semibold hover:text-[#6BB42F]">
          {item.title}
        </Link>
        <p className="text-xs font-bold">${item.price}</p>
        <Button
          variant={inCart ? "secondary" : "brand"}
          size="sm"
          className="mt-1 h-7 px-2 text-[11px]"
          onClick={addToCart}
          disabled={inCart}
        >
          <ShoppingCart className="mr-1 h-3 w-3" />
          {inCart ? "In cart" : "Add"}
        </Button>
      </div>
    </Card>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      role: "assistant",
      text: "Hi! Ask me for products — try “men's jacket under $60” or tap a suggestion below.",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setInput("");
    setSending(true);
    const userMsg: ChatMessage = { id: nextId++, role: "user", text: trimmed };
    const history = [...messages, userMsg]
      .slice(-7)
      .map(({ role, text }) => ({ role, content: text }));
    setMessages((prev) => [...prev, userMsg]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: nextId++,
          role: "assistant",
          text: data.reply ?? "Sorry, something went wrong.",
          products: data.products ?? [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: nextId++, role: "assistant", text: "Sorry, I couldn't reach the catalog. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <Card className="flex h-[480px] w-[min(92vw,360px)] flex-col overflow-hidden shadow-xl">
          <div className="flex items-center justify-between bg-[#6BB42F] px-4 py-3 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MessageCircle className="h-4 w-4" /> Shop Assistant
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="hover:opacity-80">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-neutral-50 p-3">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] space-y-2 rounded-lg px-3 py-2 text-sm",
                    m.role === "user" ? "bg-[#6BB42F] text-white" : "bg-white text-neutral-800 shadow-sm"
                  )}
                >
                  <p>{m.text}</p>
                  {m.products && m.products.length > 0 && (
                    <div className="space-y-2">
                      {m.products.map((p) => (
                        <ChatProductCard key={p.id} item={p} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-white px-3 py-2 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t bg-white p-2">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-[#6BB42F] px-2.5 py-1 text-[11px] font-medium text-[#5da128] transition hover:bg-[#6BB42F] hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search products..."
                className="h-9"
              />
              <Button type="submit" size="icon" variant="brand" className="h-9 w-9 shrink-0" disabled={sending} aria-label="Send">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}

      <Button
        size="icon"
        variant="brand"
        className="h-12 w-12 rounded-full shadow-lg"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close shop assistant" : "Open shop assistant"}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>
    </div>
  );
}
