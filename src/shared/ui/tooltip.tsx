import { Tooltip as Lib } from "@base-ui/react/tooltip";
import type React from "react";

type Props = Pick<React.ComponentProps<typeof Lib.Trigger>, "delay" | "className" | "render"> &
  Pick<React.ComponentProps<typeof Lib.Positioner>, "side"> &
  React.PropsWithChildren<{
    tooltip: React.ReactNode;
  }>;

export default function Tooltip({
  delay = 0,
  className,
  render,
  side,
  tooltip,
  children,
}: Props): React.ReactElement {
  return (
    <Lib.Root>
      <Lib.Trigger delay={delay} className={className} render={render}>
        {children}
      </Lib.Trigger>
      <Lib.Portal className="relative z-(--index-overlay)">
        <Lib.Positioner side={side} sideOffset={8}>
          <Lib.Popup className="rounded-md bg-highlight px-3 py-1.5">
            <Lib.Arrow className="relative block h-1.5 w-3 overflow-clip before:absolute before:bottom-0 before:left-1/2 before:h-[calc(6px*sqrt(2))] before:w-[calc(6px*sqrt(2))] before:transform-[translate(-50%,50%)_rotate(45deg)] before:bg-highlight before:content-[''] data-[side=bottom]:-top-1.5 data-[side=left]:-right-2.25 data-[side=left]:rotate-90 data-[side=right]:-left-2.25 data-[side=right]:-rotate-90 data-[side=top]:-bottom-1.5 data-[side=top]:rotate-180" />
            {tooltip}
          </Lib.Popup>
        </Lib.Positioner>
      </Lib.Portal>
    </Lib.Root>
  );
}

Tooltip.Provider = Lib.Provider;
