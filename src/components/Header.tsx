import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Cpu, Twitter, Github, Youtube, Coffee, MessageCircle } from 'lucide-react';

const socialLinks = [
  { icon: Twitter, href: 'https://x.com/treecitywes', label: 'X' },
  { icon: MessageCircle, href: 'https://t.me/HashHead_io', label: 'Telegram' },
  { icon: Github, href: 'https://github.com/treecitywes', label: 'GitHub' },
  { icon: Youtube, href: 'https://youtube.com/treecitywes', label: 'YouTube' },
  { icon: Coffee, href: 'https://buymeacoffee.com/treecitywes', label: 'Buy Me a Coffee' },
];

export const Header: React.FC = () => {
  return (
    <header className="relative border-b border-white/5 bg-black/50 backdrop-blur-xl">
      {/* Glow effect */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 group">
              <Cpu className="w-6 h-6 text-green-400" />
              <div className="absolute inset-0 rounded-lg bg-green-500/20 blur-xl group-hover:bg-green-500/30 transition-all" />
            </div>
            <h1 className="text-xl font-semibold">
              <span className="text-white">Claim</span><span className="text-green-400">Xen</span><span className="text-gray-400">.com</span>
            </h1>
          </div>

          {/* Right side - Social Links and Connect Button */}
          <div className="flex items-center gap-6">
            {/* Social Links */}
            <div className="hidden md:flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                  title={link.label}
                >
                  <link.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Connect Button */}
            <ConnectButton />
          </div>
        </div>

        {/* Mobile Links */}
        <div className="md:hidden flex items-center gap-4 pb-3 overflow-x-auto">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-400 transition-colors whitespace-nowrap"
            >
              <link.icon className="w-3 h-3" />
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}; 