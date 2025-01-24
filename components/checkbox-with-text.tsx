// "use client";

// import * as React from "react";
// import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
// // import { Check } from 'lucide-react' // Removed as per update 1
// import { cn } from "@/lib/utils";

// const CheckboxWithText = React.forwardRef<
//   React.ElementRef<typeof CheckboxPrimitive.Root>,
//   React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
//     label: string;
//   }
// >(({ className, label, ...props }, ref) => {
//   const [isChecked, setIsChecked] = React.useState(false);

//   return (
//     <div className="flex items-center space-x-2">
//       <CheckboxPrimitive.Root
//         ref={ref}
//         className={cn(
//           "peer h-6 w-6 shrink-0 rounded-sm border-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//           isChecked
//             ? "border-[#0165FC] bg-[#0165FC]"
//             : "border-[#757575] bg-white",
//           className
//         )}
//         onCheckedChange={(checked) => setIsChecked(!!checked)}
//         {...props}
//       >
//         <CheckboxPrimitive.Indicator
//           className={cn("flex items-center justify-center")}
//         >
//           <div className="h-4 w-4 bg-[#0165FC]" />
//         </CheckboxPrimitive.Indicator>
//       </CheckboxPrimitive.Root>
//       <label
//         className={cn(
//           "text-sm font-medium leading-none transition-colors duration-200",
//           isChecked ? "text-[#0165FC]" : "text-black"
//         )}
//       >
//         {label}
//       </label>
//     </div>
//   );
// });
// CheckboxWithText.displayName = "CheckboxWithText";

// export { CheckboxWithText };
