"use client";
import React, { useState } from "react";
import PreviewResult from "../_componenets/PreviewResult";
import FormInput from "../_componenets/FormInput";
import axios from "axios";
import { useAuthContext } from "@/app/provider";
import { toast } from "react-toastify";

type FormData = {
  file: File | undefined;
  description: string;
  size: string;
  imageUrl?: string;
  avatar?: string;
};

function ProductImages({title, enableAvatar}:any) {
  const [formData, setFormData] = useState<FormData>();
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();

  const onHandleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const OnGenerate = async () => {
    if (loading) return;
    try {
      //toast
      if (!formData?.file && !formData?.imageUrl) {
        toast.error("Please upload a product image.");
        return;
      }

      if (!formData?.description || !formData?.size) {
        toast.error("Please fill in all required fields.");
        return;
      }
      setLoading(true);

      const formData_ = new FormData();
      formData_.append("description", formData?.description ?? "");
      formData_.append("size", formData?.size ?? "");
      formData_?.append("userEmail", user?.email ?? "");

      if (formData?.file) {
        formData_.append("file", formData.file);
      }

      if (formData?.imageUrl) {
        formData_.append("imageUrl", formData.imageUrl);
      }

      if (formData?.avatar) {
        formData_?.append('avatar', formData?.avatar ?? '');
      }

      //Api Call
      const result = await axios.post("/api/generate-product-image", formData_);
      console.log(result.data);
      toast.success("Image generated successfully! 🎉");
      //setFormData(undefined);
      setLoading(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error ?? "Image generation failed.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }

      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h2 className="font-bold text-2xl mb-3">{title? title : 'AI Product Image Generator'}</h2>

      <div className="grid grid-cols-1 md:grid-cols-[380px_1px_1fr] gap-8">
        {/* Left */}
        <div>
          <FormInput
            onHandleInputChange={(field: string, value: string) =>
              onHandleInputChange(field, value)
            }
            OnGenerate={OnGenerate}
            loading={loading}
            enableAvatar={enableAvatar}
          />
        </div>

        {/* Divider */}
        <div className="hidden md:block bg-white/10 rounded-full"></div>

        {/* Right */}
        <div className="pl-2">
          <PreviewResult />
        </div>
      </div>
    </div>
  );
}

export default ProductImages;
