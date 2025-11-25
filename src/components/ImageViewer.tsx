"use client";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Image from "next/image";
import { ZoomIn, ZoomOut, RefreshCw } from "lucide-react";

interface ImageViewerProps {
  src: string;
  alt: string;
}

export default function ImageViewer({ src, alt }: ImageViewerProps) {
  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.5}
      maxScale={4}
      centerOnInit={true}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black group">
          {/* Controls */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => zoomIn()}
              className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={20} />
            </button>
            <button
              onClick={() => zoomOut()}
              className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={20} />
            </button>
            <button
              onClick={() => resetTransform()}
              className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
              title="Reset"
            >
              <RefreshCw size={20} />
            </button>
          </div>

          <TransformComponent
            wrapperClass="!w-full !h-full"
            contentClass="!w-full !h-full flex items-center justify-center"
          >
            <div className="relative w-full h-full min-h-[50vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  );
}

