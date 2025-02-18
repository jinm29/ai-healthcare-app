import React from 'react';

export function Footer() {
  return (
    <footer className="fixed bottom-0 w-full py-4 bg-zinc-900/40 dark:bg-zinc-800/40 backdrop-blur-sm">
      <div className="container mx-auto flex justify-center space-x-6">
        <a
          href="https://github.com/OpenHealthForAll/open-health"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium"
        >
          Github
        </a>
        <a
          href="https://www.reddit.com/r/AIDoctor/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium"
        >
          Reddit
        </a>
        <a
          href="https://discord.gg/B9K654g4wf"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium"
        >
          Discord
        </a>
      </div>
    </footer>
  );
} 