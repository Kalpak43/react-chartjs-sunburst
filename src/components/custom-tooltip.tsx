import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { TrendingUp, Hash, Percent } from "lucide-react";

interface TooltipProps {
  label: string;
  value: number;
  parentValue?: number;
  color?: string;
  visible?: boolean;
}

const CustomTooltip = ({
  label,
  value,
  parentValue,
  color,
  visible = true,
}: TooltipProps) => {
  const percentage = parentValue
    ? ((value / parentValue) * 100).toFixed(1)
    : null;
  const isHighValue = value > 1000;

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <LayoutGroup>
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                duration: 0.3,
                ease: [0.4, 0.0, 0.2, 1], // Custom easing for smoother feel
                opacity: { duration: 0.2, delay: 0.1 }, // Slight delay for opacity
                scale: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.4,
                },
                y: {
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  duration: 0.3,
                },
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 8,
              transition: {
                duration: 0.2,
                ease: [0.4, 0.0, 1, 1],
              },
            }}
            transition={{
              layout: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4,
              },
            }}
            className="relative bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-gray-200/50 text-sm max-w-xs"
            style={{
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            {/* Color indicator bar */}
            <motion.div
              layout
              layoutId="color-bar"
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: "100%",
                opacity: 1,
                transition: {
                  width: { delay: 0.2, duration: 0.4, ease: "easeOut" },
                  opacity: { delay: 0.15, duration: 0.2 },
                },
              }}
              transition={{
                layout: { type: "spring", stiffness: 300, damping: 30 },
              }}
              className="absolute top-0 left-0 h-1 rounded-t-xl"
              style={{ backgroundColor: color ?? "#6366f1" }}
            />

            {/* Content */}
            <motion.div
              layout
              className="space-y-2 pt-1"
              transition={{
                layout: { type: "spring", stiffness: 300, damping: 30 },
              }}
            >
              {/* Label */}
              <motion.div
                layout
                layoutId={`label-${label}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    opacity: { delay: 0.15, duration: 0.3 },
                    x: { delay: 0.15, duration: 0.3, ease: "easeOut" },
                  },
                }}
                transition={{
                  layout: { type: "spring", stiffness: 300, damping: 30 },
                }}
                className="font-semibold text-gray-800 flex items-center gap-2"
              >
                <motion.div
                  layout
                  layoutId={`color-dot-${label}`}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: 1,
                    transition: {
                      delay: 0.2,
                      type: "spring",
                      stiffness: 400,
                      damping: 20,
                    },
                  }}
                  className="w-3 h-3 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                  style={{ backgroundColor: color ?? "#6366f1" }}
                  transition={{
                    layout: { type: "spring", stiffness: 300, damping: 30 },
                  }}
                />
                <motion.span
                  layout
                  className="truncate"
                  transition={{
                    layout: { type: "spring", stiffness: 300, damping: 30 },
                  }}
                >
                  {label}
                </motion.span>
              </motion.div>

              {/* Value */}
              <motion.div
                layout
                layoutId={`value-${value}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    opacity: { delay: 0.2, duration: 0.3 },
                    x: { delay: 0.2, duration: 0.3, ease: "easeOut" },
                  },
                }}
                transition={{
                  layout: { type: "spring", stiffness: 300, damping: 30 },
                }}
                className="flex items-center gap-2 text-gray-600"
              >
                <Hash className="w-3 h-3 text-blue-500 flex-shrink-0" />
                <motion.span
                  layout
                  className="font-medium tabular-nums"
                  key={value} // Force re-render when value changes
                  initial={{ scale: 1.05, opacity: 0.8 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                      duration: 0.3,
                    },
                  }}
                  transition={{
                    layout: { type: "spring", stiffness: 300, damping: 30 },
                  }}
                >
                  {value.toLocaleString()}
                </motion.span>
              </motion.div>

              {/* Percentage */}
              <AnimatePresence mode="wait">
                {percentage && (
                  <motion.div
                    layout
                    layoutId={`percentage-${percentage}`}
                    initial={{ opacity: 0, x: -8, height: 0 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      height: "auto",
                      transition: {
                        opacity: { delay: 0.25, duration: 0.3 },
                        x: { delay: 0.25, duration: 0.3, ease: "easeOut" },
                        height: {
                          delay: 0.2,
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        },
                      },
                    }}
                    exit={{
                      opacity: 0,
                      x: -8,
                      height: 0,
                      transition: {
                        duration: 0.2,
                        height: { type: "spring", stiffness: 300, damping: 30 },
                      },
                    }}
                    transition={{
                      layout: { type: "spring", stiffness: 300, damping: 30 },
                    }}
                    className="flex items-center gap-2 text-gray-600 overflow-hidden"
                  >
                    <Percent className="w-3 h-3 text-green-500 flex-shrink-0" />
                    <motion.span
                      layout
                      className="font-medium tabular-nums"
                      key={percentage} // Force re-render when percentage changes
                      initial={{ scale: 1.05, opacity: 0.8 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                          duration: 0.3,
                        },
                      }}
                      transition={{
                        layout: { type: "spring", stiffness: 300, damping: 30 },
                      }}
                    >
                      {percentage}%
                    </motion.span>
                    <motion.div
                      layout
                      className="flex-1 bg-gray-200 rounded-full h-1.5 ml-1 overflow-hidden"
                      transition={{
                        layout: { type: "spring", stiffness: 300, damping: 30 },
                      }}
                    >
                      <motion.div
                        layoutId={`progress-bar-${percentage}`}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${percentage}%`,
                          transition: {
                            delay: 0.4,
                            duration: 0.6,
                            ease: [0.4, 0.0, 0.2, 1],
                          },
                        }}
                        transition={{
                          layout: {
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          },
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Trend indicator */}
              <AnimatePresence mode="wait">
                {isHighValue && (
                  <motion.div
                    layout
                    layoutId="trend-indicator"
                    initial={{ opacity: 0, scale: 0.8, height: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      height: "auto",
                      transition: {
                        opacity: { delay: 0.3, duration: 0.3 },
                        scale: {
                          delay: 0.3,
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                          duration: 0.4,
                        },
                        height: {
                          delay: 0.25,
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        },
                      },
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                      height: 0,
                      transition: {
                        duration: 0.2,
                        height: { type: "spring", stiffness: 300, damping: 30 },
                      },
                    }}
                    transition={{
                      layout: { type: "spring", stiffness: 300, damping: 30 },
                    }}
                    className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit overflow-hidden"
                  >
                    <TrendingUp className="w-3 h-3 flex-shrink-0" />
                    <span>High Value</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Subtle glow effect */}
            <motion.div
              layout
              layoutId={`glow-${color}`}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 0.2,
                transition: {
                  delay: 0.1,
                  duration: 0.4,
                  ease: "easeOut",
                },
              }}
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 0%, ${
                  color ?? "#6366f1"
                }20, transparent 70%)`,
              }}
              transition={{
                layout: { type: "spring", stiffness: 300, damping: 30 },
              }}
            />
          </motion.div>
        </LayoutGroup>
      )}
    </AnimatePresence>
  );
};

export default CustomTooltip;
