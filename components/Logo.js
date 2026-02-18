export default function Logo({ size = 'default' }) {
  const sizes = {
    small: { box: 'w-8 h-8 text-sm', text: 'text-lg' },
    default: { box: 'w-9 h-9 text-base', text: 'text-xl' },
    large: { box: 'w-11 h-11 text-lg', text: 'text-2xl' }
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-2.5">
      <div className={`${s.box} bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md`}>
        <span>R</span>
      </div>
      <span className={`${s.text} font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
        ResuSnap
      </span>
    </div>
  );
}