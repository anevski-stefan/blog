export function TimelineGlobalStyles() {
  return (
    <style jsx global>{`
      /* Timeline Line */
      .timeline-line {
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
        width: 2px;
        background: linear-gradient(
          to bottom,
          transparent,
          rgba(88, 101, 242, 0.3),
          rgba(88, 101, 242, 0.5),
          rgba(88, 101, 242, 0.3),
          transparent
        );
        transform: translateX(-50%);
      }
      .timeline-line-progress {
        position: absolute;
        left: 50%;
        top: 0;
        width: 2px;
        background: linear-gradient(to bottom, #5865f2, #ec4899);
        transform: translateX(-50%);
        height: 0%;
        box-shadow: 0 0 20px rgba(88, 101, 242, 0.5);
      }
      @media (max-width: 768px) {
        .timeline-line,
        .timeline-line-progress {
          left: 20px;
        }
      }
      /* Timeline Node */
      .timeline-node {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
      }
      @media (max-width: 768px) {
        .timeline-node {
          left: 20px;
        }
      }
      .node-dot {
        width: 16px;
        height: 16px;
        background: #0a0a0a;
        border: 2px solid #5865f2;
        border-radius: 50%;
        transition: all 0.3s ease;
      }
      .node-dot.active {
        background: #5865f2;
        box-shadow: 0 0 20px rgba(88, 101, 242, 0.6);
      }
      .node-ring {
        position: absolute;
        inset: -8px;
        border: 1px solid rgba(88, 101, 242, 0.3);
        border-radius: 50%;
        animation: pulse-ring 2s ease-out infinite;
      }

      /* Card Glow */
      .timeline-card {
        position: relative;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .timeline-card::before {
        content: "";
        position: absolute;
        inset: -1px;
        background: linear-gradient(
          135deg,
          rgba(88, 101, 242, 0.3),
          transparent,
          rgba(236, 72, 153, 0.2)
        );
        border-radius: inherit;
        z-index: -1;
        opacity: 0;
        transition: opacity 0.5s ease;
      }
      .timeline-card:hover::before {
        opacity: 1;
      }
      .timeline-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      }
      /* Connector Line */
      .connector-line {
        position: absolute;
        top: 50%;
        height: 2px;
        background: linear-gradient(
          to right,
          rgba(88, 101, 242, 0.5),
          rgba(88, 101, 242, 0.1)
        );
        transform: translateY(-50%);
      }
      .connector-line.left {
        right: 100%;
        width: 40px;
      }
      .connector-line.right {
        left: 100%;
        width: 40px;
        background: linear-gradient(
          to left,
          rgba(88, 101, 242, 0.5),
          rgba(88, 101, 242, 0.1)
        );
      }
      @media (max-width: 768px) {
        .connector-line {
          display: none;
        }
      }

      /* Image Reveal */
      .image-reveal {
        clip-path: inset(0 100% 0 0);
        transition: clip-path 0.8s cubic-bezier(0.77, 0, 0.175, 1);
      }
      .timeline-card:hover .image-reveal {
        clip-path: inset(0 0 0 0);
      }

      .year-marker {
        position: sticky;
        top: 100px;
        z-index: 20;
      }

      .glass {
        background: rgba(17, 17, 17, 0.8);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
      }
    `}</style>
  )
}
