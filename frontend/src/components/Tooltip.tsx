import { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  text: string;
}

export default function Tooltip({ text }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLSpanElement>(null);

  const updatePosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + rect.height / 2,
        left: rect.left + rect.width / 2,
      });
    }
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible]);

  return (
    <>
      <span
        ref={containerRef}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'help',
        }}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <span style={{
          width: '16px',
          height: '16px',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          fontWeight: '600',
          color: '#6366f1',
        }}>
          ?
        </span>
      </span>
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: 'translate(-50%, calc(-100% - 10px))',
            padding: '10px 14px',
            background: '#18181b',
            borderRadius: '8px',
            color: '#fafafa',
            fontSize: '12px',
            lineHeight: '1.5',
            whiteSpace: 'normal',
            width: 'max-content',
            maxWidth: '280px',
            zIndex: 10000,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            border: '1px solid #27272a',
            pointerEvents: 'none',
          }}
        >
          {text}
          <div
            style={{
              position: 'absolute',
              bottom: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #18181b',
            }}
          />
        </div>
      )}
    </>
  );
}
