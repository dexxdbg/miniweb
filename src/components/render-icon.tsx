import { Icons, isIconKey } from "@/app/icons";

export function RenderIcon({ icon }: { icon?: string }) {
  if (!icon) {
    const I = Icons.link;
    return <I />;
  }
  if (isIconKey(icon)) {
    const I = Icons[icon];
    return <I />;
  }
  return <span className="font-mono text-[14px] leading-none">{icon}</span>;
}
