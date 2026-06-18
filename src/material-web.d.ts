import type React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "md-assist-chip": React.HTMLAttributes<HTMLElement> & { label?: string; key?: React.Key | null };
      "md-chip-set": React.HTMLAttributes<HTMLElement>;
      "md-divider": React.HTMLAttributes<HTMLElement>;
    }
  }
}
