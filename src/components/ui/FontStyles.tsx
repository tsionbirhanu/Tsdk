export default function FontStyles() {
    return (
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0e0804; }
        ::-webkit-scrollbar-thumb { background: #3a200f; border-radius: 2px; }
        .cinzel  { font-family: 'Cinzel', serif; }
        .crimson { font-family: 'Crimson Pro', serif; }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .gold-shimmer {
          background: linear-gradient(90deg,#c8921a,#f0d060,#c8921a,#9a6e12);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }
        .card-hover { transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s; }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.5); }
      `}</style>
    );
  }