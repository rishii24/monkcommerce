import { forwardRef, useEffect, useRef } from "react";

export const Checkbox = forwardRef(
  ({ indeterminate = false, type, ...inputProps }, ref) => {
    // We need our own internal ref to ensure that it is (a) actually defined,
    // and (b) an object ref rather than a callback ref.
    const internalRef = useRef(null);

    // This function is a callback ref that will keep our internal ref and the
    // passed in ref synchronized.
    function synchronizeRefs(el) {
      // Update the internal ref.
      internalRef.current = el;

      // Update the provided ref.
      if (!ref) {
        // nothing to update
      } else if (typeof ref === "object") {
        ref.current = el;
      } else {
        // must be a callback ref
        ref(el);
      }
    }

    // We use an effect here to update the `indeterminate` attribute on the
    // input element whenever the prop value changes.
    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return <input ref={synchronizeRefs} type="checkbox" {...inputProps} className="h-5 w-5 mr-2 accent-primary" />;
  }
);
