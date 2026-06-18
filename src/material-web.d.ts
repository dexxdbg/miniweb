import type React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "md-filled-button": React.HTMLAttributes<HTMLElement> & {
        href?: string;
        target?: string;
        disabled?: boolean;
      };
      "md-outlined-button": React.HTMLAttributes<HTMLElement> & {
        href?: string;
        target?: string;
        disabled?: boolean;
      };
      "md-assist-chip": React.HTMLAttributes<HTMLElement> & { label?: string; key?: React.Key | null };
      "md-chip-set": React.HTMLAttributes<HTMLElement>;
      "md-dialog": React.HTMLAttributes<HTMLElement> & {
        open?: boolean;
        onClose?: React.ReactEventHandler<HTMLElement>;
        ref?: React.Ref<HTMLElement>;
      };
      "md-list": React.HTMLAttributes<HTMLElement>;
      "md-list-item": React.HTMLAttributes<HTMLElement> & {
        headline?: string;
        "supporting-text"?: string;
        href?: string;
        target?: string;
        key?: React.Key | null;
      };
      "md-divider": React.HTMLAttributes<HTMLElement>;
    }
  }
}
