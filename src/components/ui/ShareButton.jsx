import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from "motion/react";

const ShareButton = memo(({ url, title, description }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;
  const shareText = description || '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareLinks = [
    {
      name: 'Copy Link',
      icon: copied ? '✓' : '🔗',
      action: handleCopyLink,
      color: 'bg-neo-yellow',
    },
    {
      name: 'Twitter',
      icon: '𝕏',
      action: () => window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
        '_blank'
      ),
      color: 'bg-black text-white',
    },
    {
      name: 'Facebook',
      icon: 'f',
      action: () => window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        '_blank'
      ),
      color: 'bg-blue-600 text-white',
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      action: () => window.open(
        `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`,
        '_blank'
      ),
      color: 'bg-green-500 text-white',
    },
  ];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border-2 border-neo-black font-bold uppercase text-sm shadow-neo hover:shadow-neo-lg transition-all bg-neo-white"
        aria-label="Share"
        aria-expanded={isOpen}
      >
        <span className="mr-2">🔗</span>
        Share
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 neo-card p-2 bg-neo-white z-20 min-w-[200px]"
            >
              {shareLinks.map((link) => (
                <motion.button
                  key={link.name}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    link.action();
                    if (link.name !== 'Copy Link') {
                      setIsOpen(false);
                    }
                  }}
                  className={`w-full text-left px-4 py-2 border-2 border-neo-black font-bold text-sm mb-2 last:mb-0 ${link.color}`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.name}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

ShareButton.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};

ShareButton.displayName = 'ShareButton';

export default ShareButton;
