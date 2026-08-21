import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  showArrow?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  showArrow = true,
  className = '',
  type = 'button',
}) => {
  const baseStyles = "inline-flex items-center justify-center font-heading font-medium tracking-wide uppercase text-sm px-6 py-4 transition-all duration-300 border border-north-black group";
  
  const variantStyles = {
    primary: "bg-north-black text-north-lime hover:bg-north-lime hover:text-north-black",
    outline: "bg-transparent text-north-black hover:bg-north-black hover:text-north-lime",
    ghost: "bg-transparent text-north-black hover:bg-north-lime/20 border-transparent",
  };

  const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {showArrow && (
        <ArrowUpRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  );

  if (to) {
    return <Link to={to} className={combinedClasses}>{content}</Link>;
  }

  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={combinedClasses}>{content}</a>;
  }

  return (
    <button type={type} onClick={onClick} className={combinedClasses}>
      {content}
    </button>
  );
};
