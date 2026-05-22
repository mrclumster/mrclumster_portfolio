const BANNER_SINGLE = String.raw`
 █████╗ ███████╗██╗███████╗
██╔══██╗╚══███╔╝██║╚══███╔╝
███████║  ███╔╝ ██║  ███╔╝ 
██╔══██║ ███╔╝  ██║ ███╔╝  
██║  ██║███████╗██║███████╗
╚═╝  ╚═╝╚══════╝╚═╝╚══════╝ `;

export function AsciiBanner() {
  return (
    <div aria-hidden className="font-mono select-none" style={{ color: "var(--ink)" }}>
      <pre
        className="leading-none"
        style={{
          fontSize: "clamp(1rem, 0.8rem + 1.2vw, 2.5rem)",
          letterSpacing: 0,
          margin: 0,
        }}
      >
        {BANNER_SINGLE}
      </pre>
    </div>
  );
}
