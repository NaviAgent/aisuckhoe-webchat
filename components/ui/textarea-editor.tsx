"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { useState } from "react";

type TextareaEditorContextType = {
  value: string;
  setValue: (v: string) => void;
  setFocused: (v: boolean) => void;
};

const TextareaEditorContext =
  React.createContext<TextareaEditorContextType | null>(null);

function useTextareaEditorContext() {
  const ctx = React.useContext(TextareaEditorContext);
  if (!ctx)
    throw new Error(
      "TextareaEditor subcomponents must be used inside <TextareaEditor>"
    );
  return ctx;
}

const TextareaEditorRoot: React.FC<React.AllHTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const glowClass =
    focused || value
      ? "ring-2 ring-blue-400 shadow-[0_0_10px_2px_rgba(59,130,246,0.5)]"
      : "ring-1 ring-gray-300";

  return (
    <TextareaEditorContext.Provider value={{ value, setValue, setFocused }}>
      <div
        className={cn(
          "rounded-xl transition-all duration-300 border p-2 bg-white dark:bg-gray-950",
          glowClass,
          className
        )}
        {...props}
      >
        <div className="flex flex-col">{children}</div>
      </div>
    </TextareaEditorContext.Provider>
  );
};

const TextareaEditorContent = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, onFocus, onBlur, onChange, ...props }, ref) => {
  const { value, setValue, setFocused } = useTextareaEditorContext();

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        onChange?.(e);
      }}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      className={cn(
        "flex min-h-[80px] w-full rounded border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
TextareaEditorContent.displayName = "TextareaEditorContent";

const TextareaEditorFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-2  bg-background/80 ",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// export default function TextareaEditor() {
//   const [value, setValue] = useState("");
//   const [focused, setFocused] = useState(false);

//   const glowClass =
//     focused || value
//       ? "ring-2 ring-blue-400 shadow-[0_0_10px_2px_rgba(59,130,246,0.5)]"
//       : "ring-1 ring-gray-300";

//   return (
//     <div className="w-full max-w-2xl mx-auto">
//       <div
//         className={clsx(
//           "rounded-xl transition-all duration-300 border p-2 bg-white dark:bg-gray-950",
//           glowClass
//         )}
//       >
//         <div className="flex flex-col">
//           <Textarea
//             rows={4}
//             placeholder="What do you want to know?"
//             value={value}
//             onChange={(e) => setValue(e.target.value)}
//             onFocus={() => setFocused(true)}
//             onBlur={() => setFocused(false)}
//             className="border-none focus-visible:ring-0 resize-none bg-transparent"
//           />

//           <div className="flex items-center justify-between mt-2 px-1">
//             <div className="flex gap-2 text-muted-foreground">
//               <ImagePlus className="w-5 h-5 cursor-pointer" />
//               <Paperclip className="w-5 h-5 cursor-pointer" />
//               <Dialog>
//                 <DialogTrigger asChild>
//                   <Button variant="ghost" size="icon">
//                     <Maximize2 className="w-5 h-5" />
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="max-w-3xl">
//                   <Textarea
//                     rows={12}
//                     placeholder="Edit in fullscreen..."
//                     value={value}
//                     onChange={(e) => setValue(e.target.value)}
//                     className="resize-none"
//                   />
//                 </DialogContent>
//               </Dialog>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button
//                 size="icon"
//                 className="bg-gradient-to-r from-green-400 to-teal-500 text-white"
//               >
//                 <Send className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
export const TextareaEditor = Object.assign(TextareaEditorRoot, {
  Content: TextareaEditorContent,
  Footer: TextareaEditorFooter,
});
