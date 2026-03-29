import { useState, useEffect } from "react";
import { Github, ExternalLink, Droplets } from "lucide-react";
import GooeyFabShowcase from "./pages/GooeyFabShowcase";

interface ComponentCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
  gradient: string;
}

const COMPONENTS: ComponentCard[] = [
  {
    id: "gooey-fab",
    title: "Gooey FAB",
    description:
      "Floating action button with SVG-based surface tension physics. Bubbles merge and split with a liquid membrane effect.",
    icon: <Droplets className="w-6 h-6" />,
    tags: ["React", "Framer Motion", "SVG Filters", "Animation"],
    gradient: "from-orange-500 to-amber-500",
  },
];

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash.slice(1) || "");

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash.slice(1) || "");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return hash;
}

function Portfolio() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange to-brand-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">PG</span>
            </div>
            <span className="font-semibold text-gray-900">Piyush Gautam</span>
          </div>
          <a
            href="https://github.com/piyushgIITian"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Frontend Components
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
          A collection of polished, open-source React components. Built with care,
          ready to copy into your project.
        </p>
      </div>

      {/* Component Grid */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMPONENTS.map((component) => (
            <a
              key={component.id}
              href={`#${component.id}`}
              className="group block rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300"
            >
              {/* Preview area */}
              <div
                className={`relative h-40 bg-gradient-to-br ${component.gradient} flex items-center justify-center overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                <div className="relative text-white/90 group-hover:scale-110 transition-transform duration-300">
                  {component.icon}
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4 text-white/70" />
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-1.5 group-hover:text-brand-orange transition-colors">
                  {component.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  {component.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {component.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}

          {/* Coming soon placeholder */}
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 flex items-center justify-center h-[280px]">
            <div className="text-center px-6">
              <p className="text-sm font-medium text-gray-400 mb-1">More coming soon</p>
              <p className="text-xs text-gray-400">New components are always in the works</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-400">
            Built by{" "}
            <a
              href="https://github.com/piyushgIITian"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-orange hover:underline"
            >
              Piyush Gautam
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const route = useHashRoute();

  switch (route) {
    case "gooey-fab":
      return <GooeyFabShowcase />;
    default:
      return <Portfolio />;
  }
}
