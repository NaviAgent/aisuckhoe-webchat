"use client";

import * as React from "react";
import { VisuallyHidden as VisuallyHiddenPrimitive } from "@radix-ui/react-visually-hidden";

function VisuallyHidden({
  ...props
}: React.ComponentProps<typeof VisuallyHiddenPrimitive>) {
  return <VisuallyHiddenPrimitive data-slot="VisuallyHidden" {...props} />;
}

export { VisuallyHidden };
