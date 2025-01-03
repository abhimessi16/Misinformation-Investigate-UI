import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type LiveStreamResponse = {
  ffmpeg_pid: number
  source: string
}