export const BREAKPOINTS = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
};

export const ANIMATIONS = {
    spring: {
        type: "spring",
        stiffness: 260,
        damping: 20
    },
    tap: {
        scale: 0.95
    },
    hover: {
        scale: 1.02,
        transition: { duration: 0.2 }
    },
    fadeUp: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
    }
};
