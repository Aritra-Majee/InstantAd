"use client";
import {
  ImagePlusIcon,
  Loader2Icon,
  Monitor,
  RectangleHorizontal,
  RectangleVertical,
  Smartphone,
  Sparkle,
  Square,
} from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const sampleProduct = [
  {
    preview: "/product2.jpg",
    url: "https://ik.imagekit.io/qdn0jrzwm/products/product2.jpg",
  },
  {
    preview: "/product3.jpg",
    url: "https://ik.imagekit.io/qdn0jrzwm/products/product3.jpg",
  },
  {
    preview: "/product4.jpg",
    url: "https://ik.imagekit.io/qdn0jrzwm/products/product4.jpg",
  },
  {
    preview: "/product5.jpg",
    url: "https://ik.imagekit.io/qdn0jrzwm/products/product5.jpg",
  },
  {
    preview: "/product6.jpg",
    url: "https://ik.imagekit.io/qdn0jrzwm/products/product6.jpg",
  }

];

const AvatarList = [
  {
    name: "model1.png",
    url: "https://ik.imagekit.io/qdn0jrzwm/avatar/model1.png",
  },
  {
    name: "model2.png",
    url: "https://ik.imagekit.io/qdn0jrzwm/avatar/model2.jpg",
  },
  {
    name: "model3.png",
    url: "https://ik.imagekit.io/qdn0jrzwm/avatar/stock-avatars-2.webp",
  },
  {
    name: "model4.png",
    url: "https://ik.imagekit.io/qdn0jrzwm/avatar/675703157f0da.webp",
  },
];

type Props = {
  onHandleInputChange: any,
  OnGenerate: any,
  loading: boolean,
  enableAvatar: boolean
};

function FormInput({ onHandleInputChange, OnGenerate, loading, enableAvatar }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedAvatar, setselectedAvatar]=useState<string>()
  const onFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
      //Toastify
    }
    onHandleInputChange("file", file);
    onHandleInputChange("imageUrl", undefined);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div>
      <div>
        <h2 className="font-semibold">1. Upload Product Image</h2>
        <div>
          <label
            htmlFor="imageUpload"
            className="mt-2 border-dashed border-2 rounded-xl flex flex-col p-4 items-center justify-center min-h-[200px] cursor-pointer"
          >
            {!preview ? (
              <div className="flex flex-col items-center gap-3">
                <ImagePlusIcon className="h-8 w-8 opacity-40" />
                <h2 className="text-xl">Click here to upload Image</h2>
                <p className="opacity-45">Upload image upto 5MB</p>
              </div>
            ) : (
              <Image
                src={preview}
                alt="preview"
                width={300}
                height={300}
                className="w-full h-full max-h-[200] object-contain rounded-lg"
              />
            )}
          </label>
          <input
            type="file"
            id="imageUpload"
            className="hidden"
            accept="image/*"
            onChange={(event) => onFileSelect(event.target.files)}
          />
        </div>
        {/*Sample Products*/}
        {!enableAvatar && <div>
          <h2 className="opacity-40 text-center mt-3 mb-3">
            Select Sample product to try
          </h2>
          <div className="flex gap-5 items-center">
            {sampleProduct.map((product, index) => (
              <Image
                src={product.preview}
                alt={product.preview}
                width={100}
                height={100}
                className="w-[60px] h-[60px] rounded-lg cursor-pointer hover:scale-110 transition-all"
                key={index}
                onClick={() => {
                  setPreview(product.preview);
                  onHandleInputChange("imageUrl", product.url);
                  onHandleInputChange("file", undefined);
                }}
              />
            ))}
          </div>
        </div>}

      </div>

      {enableAvatar && <div className="mt-8">
        <h2 className="font-semibold">2. Select Avatar</h2>
        <div className='grid grid-cols-4 gap-3 mt-2'>
          {AvatarList.map((avatar,index)=>(
            <Image src={avatar.url} alt={avatar.name} width={200} height={200} className={`rounded-lg h-[100px] w-[80px] cursor-pointer object-cover
              ${avatar.name==selectedAvatar&&'border-2 border-primary'}
              `} key={index} onClick={()=>{setselectedAvatar(avatar.name);onHandleInputChange('avatar', avatar.url)}} />
          ))}
        </div>
      </div>}

      <div className="mt-8">
        <h2 className="font-semibold">2. Enter Product Description</h2>
        <Textarea
          placeholder="Tell me more about your product and how want to display"
          className="min-h-[150px] mt-2"
          onChange={(e) => onHandleInputChange("description", e.target.value)}
        />
      </div>
      <div className="mt-8">
        <h2 className="font-semibold">3. Select Image Size</h2>
        <Select onValueChange={(value) => onHandleInputChange("size", value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Resolution" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1024x1024">
              <div className="flex gap-2 items-center">
                <Square className="h-4 w-4" />
                <span>1:1</span>
              </div>
            </SelectItem>
            <SelectItem value="1536x1024">
              <div className="flex gap-2 items-center">
                <Monitor className="h-4 w-4" />
                <span>16:9</span>
              </div>
            </SelectItem>
            <SelectItem value="1024x1536">
              <div className="flex gap-2 items-center">
                <Smartphone className="h-4 w-4" />
                <span>9:16</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button disabled={loading} className="mt-5 w-full" onClick={OnGenerate}>
        {loading?<Loader2Icon className='animate-spin'/>:<Sparkle />}
        Generate
      </Button>
    </div>
  );
}

export default FormInput;
