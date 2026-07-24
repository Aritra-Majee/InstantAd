import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AiTools = [
  {
    name: "AI Products Images",
    desc: "Generate high-quality, professional product images instantly with AI.",
    banner: "/product-image.png",
    path: "/creative-ai-tools/product-images",
  },
  {
    name: "AI Products With Model",
    desc: "Bring your products to life with AI Models.",
    banner: "/product-avatar.png",
    path: "/creative-ai-tools/product-avatar",
  },
];

function AiToolList() {
  return (
    <div>
      <h2 className="font-bold text-2xl mb-2">Creative AI Tools</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-6xl">
        {AiTools.map((tool, index) => (
          <div key={tool.path} className="flex items-stretch justify-between p-8 bg-zinc-800 rounded-3xl min-h-[340px]">
            <div className="flex flex-col justify-between flex-1 pr-6">
              <div>
                <h2 className="font-bold text-3xl leading-tight">
                  {tool.name}
                </h2>
                <p className="mt-4 text-zinc-400 leading-7 text-base">
                  {tool.desc}
                </p>
              </div>

              <Link href={tool.path}>
                <Button>Create Now</Button>
              </Link>
            </div>

            <Image
              src={tool.banner}
              alt={tool.name}
              width={400}
              height={300}
              className="w-[260px] object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AiToolList;
