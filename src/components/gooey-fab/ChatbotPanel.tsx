import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { X, Send, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatbotPanelProps {
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
}

const QA_PAIRS: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["what is", "about", "gooey fab"],
    answer:
      "Gooey FAB is a floating action button component with SVG-based surface tension physics. Bubbles merge and split with a liquid membrane effect powered by SVG filters.",
  },
  {
    keywords: ["how to use", "install", "setup", "get started"],
    answer:
      "Copy the gooey-fab folder into your project. Import GooeyFab and pass your bubble config. You need React, Framer Motion, Lucide React, and Tailwind CSS.",
  },
  {
    keywords: ["secondary", "sub-menu", "submenu", "nested"],
    answer:
      'Set hasSubMenu: true on a bubble and pass a secondaryMenu prop with its bubbles. The sub-menu appears with a train drop-off/pickup animation pattern.',
  },
  {
    keywords: ["gooey", "filter", "svg", "surface tension", "physics"],
    answer:
      "The gooey effect uses SVG filters: feGaussianBlur merges nearby circle edges, then feColorMatrix sharpens them back. feComposite keeps icons crisp. Tune it with gooeyIntensity prop.",
  },
  {
    keywords: ["customize", "color", "icon", "config"],
    answer:
      "Each bubble accepts color and hoverColor Tailwind classes. The main button accepts icon, color, hoverColor, and size. Everything is configurable via props.",
  },
  {
    keywords: ["animation", "spring", "framer"],
    answer:
      "Animations use Framer Motion springs. Primary bubbles use staggered spring animations. Secondary bubbles use a waypoint-based drop-off/pickup pattern.",
  },
  {
    keywords: ["panel", "chatbot", "chat"],
    answer:
      'Set opensPanel: true on a bubble and pass a renderPanel prop. When that bubble is clicked, the FAB closes and your panel component appears.',
  },
  {
    keywords: ["position", "placement", "corner"],
    answer:
      'Use the position prop: "bottom-right" (default) or "bottom-left". The FAB anchors to that screen corner.',
  },
];

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "bot",
  content:
    "Hi! I'm the Gooey FAB assistant. Ask me about the component, customization, animations, or the gooey physics effect!",
};

function findAnswer(input: string): string {
  const lower = input.toLowerCase().trim();

  for (const pair of QA_PAIRS) {
    if (pair.keywords.some((kw) => lower.includes(kw))) {
      return pair.answer;
    }
  }

  const words = lower.split(/\s+/);
  for (const pair of QA_PAIRS) {
    for (const kw of pair.keywords) {
      const kwWords = kw.split(/\s+/);
      if (kwWords.some((kwWord) => words.includes(kwWord) && kwWord.length > 3)) {
        return pair.answer;
      }
    }
  }

  return "I'm not sure about that. Try asking about the gooey effect, customization, animations, or the secondary menu!";
}

export function ChatbotPanel({ onClose }: ChatbotPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Delay registration so the opening click doesn't immediately trigger close
    const timer = setTimeout(() => {
      function handleClickOutside(e: MouseEvent) {
        if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
          onClose();
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      cleanupRef.current = () => document.removeEventListener("mousedown", handleClickOutside);
    }, 0);
    return () => {
      clearTimeout(timer);
      cleanupRef.current?.();
    };
  }, [onClose]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "bot",
        content: findAnswer(text),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  }, [input]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="fixed bottom-24 right-6 z-[101] w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-brand-orange text-white rounded-t-2xl shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold text-sm">Gooey FAB Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="Close chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed",
              msg.role === "bot"
                ? "bg-gray-100 text-foreground rounded-bl-sm mr-auto"
                : "bg-brand-orange text-white rounded-br-sm ml-auto"
            )}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-3 py-3 border-t border-border shrink-0">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Gooey FAB..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={cn(
              "p-1.5 rounded-lg transition-colors cursor-pointer",
              input.trim()
                ? "bg-brand-orange text-white hover:bg-brand-orange-500"
                : "text-muted-foreground"
            )}
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
