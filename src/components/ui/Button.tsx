import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg' | 'icon'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}, ref) => {
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700',
        ghost: 'hover:bg-neutral-800 text-neutral-300',
        danger: 'bg-red-900/50 text-red-200 hover:bg-red-900/70 py-1'
    }

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-lg',
        icon: 'h-9 w-9 p-0 flex items-center justify-center'
    }

    return (
        <button
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    )
})

Button.displayName = "Button"

export { Button }
