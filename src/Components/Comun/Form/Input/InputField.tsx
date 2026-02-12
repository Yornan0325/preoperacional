// import { type FC, forwardRef } from "react";
// import type { UseFormRegisterReturn } from "react-hook-form";

// type InputSize = "sm" | "md" | "lg";
// type InputWidth = "full" | "auto" | "fit";
// interface InputProps {
//     type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
//     id?: string;
//     placeholder?: string;
//     className?: string;
//     min?: string | number;
//     max?: string | number;
//     disabled?: boolean;
//     readOnly?: boolean;
//     step?: number;
//     success?: boolean;
//     hint?: string;
//     errorMessage?: string;
//     register?: UseFormRegisterReturn;
//     value?: string | number;
//     onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

//     /** 🔥 nuevo */
//     size?: InputSize;
//      width?: InputWidth;
// }


// const Input = forwardRef<HTMLInputElement, InputProps>(
//     (
//         {
//             type = "text",
//             id,
//             placeholder,
//             className = "",
//             min,
//             max,
//             step,
//              width = "full", 
//             disabled = false,
//             readOnly = false,
//             success = false,
//             errorMessage,
//             hint,
//             register,
//             value,
//             onChange,
//             size = "md", // 👈 default
//             ...props
//         },
//         ref
//     ) => {

//         const widthClasses: Record<InputWidth, string> = {
//             full: "w-full",
//             auto: "w-auto",
//             fit: "w-fit",
//         };  
//         const sizeClasses: Record<InputSize, string> = {
//             sm: "h-9 px-3 py-2 text-xs",
//             md: "h-11 px-4 py-2.5 text-sm",
//             lg: "h-13 px-5 py-3 text-base",
//         };
//       let inputClasses = `
//       rounded-lg border appearance-none shadow-theme-xs
//       placeholder:text-gray-400 focus:outline-none focus:ring
//       dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30
//       ${sizeClasses[size]}
//       ${widthClasses[width]}
//       ${className}
//     `;

//         if (disabled) {
//             inputClasses += ` text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
//         } else if (errorMessage) {
//             inputClasses += ` text-error-800 border-error-500 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500`;
//         } else if (success) {
//             inputClasses += ` text-success-500 border-success-400 focus:ring-success-500/10 dark:text-success-400 dark:border-success-500`;
//         } else {
//             inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800`;
//         }
        
//         return (
//             <div className={width === "full" ? "w-full" : "inline-block"}>
//                 <input
//                     ref={ref}
//                     type={type}
//                     id={id}
//                     placeholder={placeholder}
//                     min={min}
//                     max={max}
//                     step={step}
//                     disabled={disabled}
//                     readOnly={readOnly}
//                     className={inputClasses}
//                     value={value}
//                     onChange={onChange}
//                     {...register}
//                     {...props}
//                 />

//                 {errorMessage && (
//                     <p className="mt-1.5 text-xs text-error-500">{errorMessage}</p>
//                 )}

//                 {hint && !errorMessage && (
//                     <p
//                         className={`mt-1.5 text-xs ${success ? "text-success-500" : "text-gray-500"
//                             }`}
//                     >
//                         {hint}
//                     </p>
//                 )}
//             </div>
//         );
//     }
// );


// export default Input;