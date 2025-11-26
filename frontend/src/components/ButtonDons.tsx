import { useNavigate } from 'react-router-dom';

interface ButtonDonsProps {
  numeroH?: string;
}

export function ButtonDons({ numeroH }: ButtonDonsProps) {
  const navigate = useNavigate();

  return (
    <div className="mt-8 flex justify-center">
      <button
        onClick={() => navigate('/zaka')}
        className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3 text-lg"
      >
        💚 Faire un Don
      </button>
    </div>
  );
}




