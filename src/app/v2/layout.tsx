export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`html, body { background: #1c1b1f !important; }`}</style>
      {children}
    </>
  );
}
