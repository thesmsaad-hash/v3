import React, { useEffect, useRef, useState } from 'react';

interface CursorPos {
  x: number;
  y: number;
}

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Use refs for smooth animation without re-renders
  const mousePos = useRef<CursorPos>({ x: -100, y: -100 });
  const ringPos = useRef<CursorPos>({ x: -100, y: -100 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Hide on touch / mobile devices
    if ('ontouchstart' in window) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Snap dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Detect hover on interactive elements
    const addHoverEvents = () => {
      const interactives = document.querySelectorAll(
        'a, button, input, textarea, select, [role="button"], label'
      );
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    };

    // Lagging ring animation loop
    const animate = () => {
      const lag = 0.12;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lag;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lag;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    addHoverEvents();

    rafRef.current = requestAnimationFrame(animate);

    // Re-attach hover events when DOM changes (e.g. route changes)
    const observer = new MutationObserver(addHoverEvents);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <>
      {/* Outer lagging ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: `2px solid ${isHovering ? '#ccff00' : 'rgba(0,0,0,0.7)'}`,
          backgroundColor: isHovering ? 'rgba(204,255,0,0.08)' : 'transparent',
          transform: 'translate(-100px, -100px)',
          transition: 'border-color 0.2s ease, background-color 0.2s ease, width 0.2s ease, height 0.2s ease',
          opacity: isVisible ? 1 : 0,
          mixBlendMode: 'multiply',
          ...(isHovering ? { width: 52, height: 52 } : {}),
          ...(isClicking ? { width: 32, height: 32 } : {}),
        }}
      />

      {/* Inner solid dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: isHovering ? '#ccff00' : '#000000',
          transform: 'translate(-100px, -100px)',
          transition: 'background-color 0.15s ease, transform 0.05s linear, width 0.15s ease, height 0.15s ease',
          opacity: isVisible ? 1 : 0,
          ...(isClicking ? { width: 6, height: 6 } : {}),
        }}
      />
    </>
  );
};
