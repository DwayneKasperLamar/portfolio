'use client';

interface ButtonProps {
  name: string;
  isBeam?: boolean;
  containerClass?: string;
}

const Button = ({ name, isBeam = false, containerClass = '' }: ButtonProps) => {
  return (
    <button className={`btn ${containerClass}`}>
      {name}
      {isBeam && (
        <span className="relative flex h-3 w-3">
          <span className="btn-ping"></span>
          <span className="btn-ping_dot"></span>
        </span>
      )}
    </button>
  );
};

export default Button;
