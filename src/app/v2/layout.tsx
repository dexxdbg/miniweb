export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#1c1b1f", overflowY: "auto" }}>
      <style>{`[data-slot="sheet-content"] { background: #211f26 !important; border-color: #49454f !important; color: #e6e1e5 !important; }`}</style>
      {children}
    </div>
  );
}
