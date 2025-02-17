import React from 'react';

export function NavLinks() {
  return (
    <nav className="w-full py-4 bg-zinc-900/40 backdrop-blur-sm">
      <div className="container mx-auto flex justify-center space-x-6">
        <a
          href="https://github.com/OpenHealthForAll/open-health"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-zinc-400 hover:text-white transition-colors font-medium"
        >
          Github
        </a>
        <a
          href="https://www.reddit.com/r/AIDoctor/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-zinc-400 hover:text-white transition-colors font-medium"
        >
          Reddit
        </a>
        <a
          href="https://discord.gg/B9K654g4wf"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-zinc-400 hover:text-white transition-colors font-medium"
        >
          Discord
        </a>
      </div>
    </nav>
  );
} 