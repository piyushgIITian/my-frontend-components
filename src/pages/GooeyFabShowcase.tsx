import { useState } from "react";
import {
  MessageCircle,
  Home,
  MoreHorizontal,
  X,
  Settings,
  FileText,
  Star,
  LayoutList,
  Copy,
  Check,
  Github,
  Zap,
  Layers,
  Paintbrush,
  ArrowLeft,
} from "lucide-react";
import { GooeyFab } from "../components/gooey-fab";
import { ChatbotPanel } from "../components/gooey-fab";
import type { BubbleItem, SecondaryBubbleItem } from "../components/gooey-fab";

const primaryBubbles: BubbleItem[] = [
  {
    id: "more",
    icon: <MoreHorizontal className="w-5 h-5 text-white" />,
    activeIcon: <X className="w-5 h-5 text-white" />,
    label: "More options",
    color: "bg-brand-blue",
    hoverColor: "hover:bg-brand-blue-600",
    hasSubMenu: true,
  },
  {
    id: "chat",
    icon: <MessageCircle className="w-5 h-5 text-white" />,
    label: "Open chatbot",
    color: "bg-brand-orange-400",
    hoverColor: "hover:bg-brand-orange-500",
    opensPanel: true,
  },
  {
    id: "home",
    icon: <Home className="w-5 h-5 text-white" />,
    label: "Go home",
    color: "bg-brand-orange-300",
    hoverColor: "hover:bg-brand-orange-400",
  },
];

const secondaryBubbles: SecondaryBubbleItem[] = [
  { id: "settings", icon: <Settings className="w-5 h-5 text-white" strokeWidth={1.5} />, label: "Settings" },
  { id: "documents", icon: <FileText className="w-5 h-5 text-white" strokeWidth={1.5} />, label: "Documents" },
  { id: "reviews", icon: <Star className="w-5 h-5 text-white" strokeWidth={1.5} />, label: "Reviews" },
  { id: "listings", icon: <LayoutList className="w-5 h-5 text-white" strokeWidth={1.5} />, label: "Listings" },
];

const MINIMAL_CODE = `import { GooeyFab } from "./components/gooey-fab";
import { Home, Settings } from "lucide-react";

function App() {
  return (
    <GooeyFab
      bubbles={[
        { id: "home", icon: <Home className="w-5 h-5 text-white" />, label: "Home" },
        { id: "settings", icon: <Settings className="w-5 h-5 text-white" />, label: "Settings" },
      ]}
      onBubbleClick={(id) => console.log("Clicked:", id)}
    />
  );
}`;

const FULL_CODE = `import { GooeyFab, ChatbotPanel } from "./components/gooey-fab";
import { MoreHorizontal, X, MessageCircle, Home, Settings, FileText } from "lucide-react";

function App() {
  return (
    <GooeyFab
      bubbles={[
        {
          id: "more",
          icon: <MoreHorizontal className="w-5 h-5 text-white" />,
          activeIcon: <X className="w-5 h-5 text-white" />,
          label: "More",
          hasSubMenu: true,
        },
        {
          id: "chat",
          icon: <MessageCircle className="w-5 h-5 text-white" />,
          label: "Chat",
          opensPanel: true,
          color: "bg-brand-orange-400",
        },
        {
          id: "home",
          icon: <Home className="w-5 h-5 text-white" />,
          label: "Home",
          color: "bg-brand-orange-300",
        },
      ]}
      secondaryMenu={{
        bubbles: [
          { id: "settings", icon: <Settings className="w-5 h-5 text-white" />, label: "Settings" },
          { id: "docs", icon: <FileText className="w-5 h-5 text-white" />, label: "Docs" },
        ],
      }}
      renderPanel={(onClose) => <ChatbotPanel onClose={onClose} />}
      onBubbleClick={(id) => console.log(id)}
      gooeyIntensity="medium"
    />
  );
}`;

function CodeBlock({ code, title }: { code: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed bg-gray-900 text-gray-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow">
      <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center mb-4">{icon}</div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

export default function GooeyFabShowcase() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="mb-8">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </a>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-medium mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Open Source Component
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight mb-6">
            Gooey{" "}
            <span className="bg-gradient-to-r from-brand-orange to-brand-orange-400 bg-clip-text text-transparent">FAB</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A floating action button with SVG-based surface tension physics. Bubbles merge and split
            with a liquid membrane effect. Fully configurable, supports nested sub-menus, and works
            with any React project.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://github.com/piyushgIITian/my-frontend-components"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-gray-900 font-medium text-sm hover:bg-gray-100 transition-colors"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
            <a
              href="#usage"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-orange text-white font-medium text-sm hover:bg-brand-orange-500 transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>

      {/* Try it callout */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-brand-orange/5 border border-brand-orange/20">
          <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center shrink-0">
            <span className="text-white text-lg font-bold">+</span>
          </div>
          <p className="text-sm text-gray-600">
            <strong className="text-gray-900">Try it live!</strong> Click the orange FAB button in
            the bottom-right corner to see the gooey surface tension effect in action.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Features</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard icon={<Zap className="w-5 h-5 text-brand-orange" />} title="SVG Gooey Physics" description="Liquid surface tension effect using feGaussianBlur + feColorMatrix. No canvas, no WebGL, pure SVG filters." />
          <FeatureCard icon={<Layers className="w-5 h-5 text-brand-orange" />} title="Nested Sub-menus" description="Bubbles can spawn their own sub-menu with a train drop-off/pickup animation pattern." />
          <FeatureCard icon={<Paintbrush className="w-5 h-5 text-brand-orange" />} title="Fully Configurable" description="Custom icons, colors, sizes, positions, gooey intensity, and panel components. Everything via props." />
          <FeatureCard icon={<MessageCircle className="w-5 h-5 text-brand-orange" />} title="Panel Support" description="Any bubble can open a custom panel (chatbot, settings, notifications). Pass any React component." />
          <FeatureCard icon={<Settings className="w-5 h-5 text-brand-orange" />} title="Spring Animations" description="Framer Motion spring physics for natural, bouncy animations. Staggered entry and exit timing." />
          <FeatureCard icon={<Star className="w-5 h-5 text-brand-orange" />} title="Accessibility" description="Keyboard navigation (Escape to close), ARIA labels, screen reader support, focus management." />
        </div>
      </div>

      {/* Code examples */}
      <div id="usage" className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">Usage</h2>
        <p className="text-gray-500 text-center mb-10">
          Copy the <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">gooey-fab</code> folder into your project.
        </p>
        <div className="space-y-8">
          <CodeBlock title="Minimal — 2 bubbles, no sub-menu" code={MINIMAL_CODE} />
          <CodeBlock title="Full — sub-menu + chatbot panel" code={FULL_CODE} />
        </div>
      </div>

      {/* Dependencies */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Dependencies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {["React 19+", "Framer Motion 12+", "Lucide React", "Tailwind CSS 4+"].map((dep) => (
            <div key={dep} className="text-center p-4 rounded-xl border border-gray-200 bg-gray-50">
              <span className="text-sm font-medium text-gray-700">{dep}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-400">
            Built by{" "}
            <a href="https://github.com/piyushgIITian" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline">
              Piyush Gautam
            </a>
          </p>
        </div>
      </footer>

      {/* Live FAB demo */}
      <GooeyFab
        bubbles={primaryBubbles}
        secondaryMenu={{ bubbles: secondaryBubbles }}
        renderPanel={(onClose) => <ChatbotPanel onClose={onClose} />}
        onBubbleClick={(id) => console.log("Bubble clicked:", id)}
        gooeyIntensity="medium"
      />
    </div>
  );
}
