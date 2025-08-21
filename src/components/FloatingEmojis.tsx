import React, { useEffect, useState } from 'react';

const FloatingEmojis: React.FC = () => {
  const [emojis, setEmojis] = useState<Array<{
    id: number;
    emoji: string;
    x: number;
    y: number;
    delay: number;
    duration: number;
  }>>([]);

  const emojiList = ['🔧', '⚡', '🚀', '💡', '✨', '🎯', '🔥', '💪', '🎉', '🌟', '⭐', '✅'];

  useEffect(() => {
    const newEmojis = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      delay: Math.random() * 1000,
      duration: 2000 + Math.random() * 1000,
    }));

    setEmojis(newEmojis);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {emojis.map((emoji) => (
        <div
          key={emoji.id}
          className="absolute text-4xl animate-float"
          style={{
            left: `${emoji.x}px`,
            top: `${emoji.y}px`,
            animationDelay: `${emoji.delay}ms`,
            animationDuration: `${emoji.duration}ms`,
          }}
        >
          {emoji.emoji}
        </div>
      ))}
    </div>
  );
};

export default FloatingEmojis;