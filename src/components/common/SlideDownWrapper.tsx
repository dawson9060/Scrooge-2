import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { ReactElement } from "react";

export const SlideDownWrapper = ({
  children,
  isOpen,
}: {
  children: ReactElement;
  isOpen: boolean;
}) => {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="form"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            overflow: "hidden",
          }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
