import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "w-full sm:w-auto inline-flex items-center justify-center rounded-md font-sans font-bold uppercase tracking-[0.1em] transition-all duration-300 outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 shadow-md hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        primary:
          "bg-gold text-white border-2 border-gold hover:bg-gold-dark hover:border-gold-dark",
        outline:
          "bg-transparent text-gold border-2 border-gold hover:text-gold-dark hover:border-gold-dark",
        navy: "bg-navy text-white border-2 border-navy hover:bg-navy-light hover:border-navy-light",
      },
      size: {
        default: "px-10 py-4 text-base",
        sm: "px-6 py-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
