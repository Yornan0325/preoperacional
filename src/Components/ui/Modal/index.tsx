import React, { useRef, useEffect } from "react";
import IconLucide from "../../Icon/IconLucide";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"; // Prop adicional para control total
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
  showCloseButton = true,
  isFullscreen = false,
  maxWidth = "md",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Manejo de tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Bloqueo de scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  // Mapa de anchos máximos para mayor flexibilidad
  const maxWConfig = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-[95%]",
  };

  const containerClasses = isFullscreen
    ? "w-full h-full min-h-screen"
    : `relative w-[calc(100%-2rem)] ${maxWConfig[maxWidth]} rounded-3xl shadow-2xl ring-1 ring-black/5`;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay con desenfoque refinado */}
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenido del Modal */}
      <div
        ref={modalRef}
        className={`
          ${containerClasses}
          bg-white dark:bg-gray-900 
          p-6 md:p-10
          overflow-hidden
          animate-in zoom-in-95 fade-in duration-200
          ${className}
        `}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="
              absolute right-4 top-4 z-10
              flex h-10 w-10 items-center justify-center 
              rounded-full bg-gray-50 text-gray-500 
              transition-all duration-200 
              hover:bg-gray-100 hover:text-gray-900 
              active:scale-95
              dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white
            "
          >
            <IconLucide name="x" size={20} strokeWidth={2} />
          </button>
        )}

        <div className="h-full overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};