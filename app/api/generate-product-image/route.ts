import { NextRequest, NextResponse } from "next/server";
import imagekit from "@/lib/imagekit";
import axios from "axios";
import cloudflare from "@/lib/cloudflare";
import fs from "fs";
import { doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";

const productPrompt = `You are an expert commercial product advertisement designer.

Use the uploaded product image as the exact subject. Preserve the product's shape, branding, label, colors, and proportions without modification.

Create a premium, high-end commercial advertisement with the product as the main focus in the center of the frame.

Generate a visually striking scene using realistic lighting, dramatic shadows, cinematic composition, and high-quality reflections. Add dynamic splashes, particles, smoke, water, fruits, flowers, spices, ice, or other theme-relevant elements that naturally complement the product. Use a clean, vibrant background with depth, gradients, and subtle bokeh to make the product stand out.

Ensure the product is perfectly sharp, highly detailed, professionally lit, and occupies the primary visual focus. Create a luxury advertising aesthetic suitable for social media campaigns, e-commerce banners, and premium brand marketing.

Do not crop, distort, replace, or redesign the uploaded product. Maintain the original logo, packaging, text, and proportions exactly as provided.

The final output should be ultra-realistic, commercial-quality, 8K, HDR, studio photography style, highly detailed, vibrant, visually appealing, and ready for marketing.`;

const avatarPrompt = `You are an expert luxury commercial advertising photographer and creative director.

You are given two input images:

Input Image 0:
- The product.

Input Image 1:
- The human model.

Create a premium commercial advertisement where the model is naturally interacting with the uploaded product. The interaction should feel authentic and appropriate for the product category (holding, wearing, carrying, using, presenting, or showcasing it naturally).

Preserve both the product and the model exactly as provided.

Product Preservation:
- Preserve the product's branding, logo, packaging, colors, text, materials, proportions, and overall appearance exactly.
- Do not redesign, modify, crop, replace, or distort the product.

Model Preservation:
- Preserve the model's face, identity, hairstyle, skin tone, body proportions, clothing, and overall appearance.
- Do not change the person's identity or create unrealistic facial features.

Composition:
- Make the product the primary focal point.
- Position the model naturally so attention is directed toward the product.
- Use realistic body posture, hand placement, and eye direction.
- Ensure correct perspective and natural interaction between the model and the product.

Environment:
Generate a premium environment that complements the product category. Depending on the product, create an appropriate luxury setting such as:
- Modern studio
- High-end retail environment
- Luxury lifestyle interior
- Premium office
- Elegant kitchen
- Outdoor travel scene
- Fashion editorial setup
- Fitness studio
- Coffee shop
- Luxury hotel
- Minimal architectural background

Choose whichever environment best enhances the product while maintaining a sophisticated commercial aesthetic.

Lighting:
Use professional advertising photography lighting with soft key lighting, subtle rim lighting, realistic shadows, premium reflections, and balanced contrast.

Background:
Create a clean, elegant background with cinematic depth of field, soft gradients, tasteful bokeh, and minimal premium design elements. Avoid unnecessary clutter.

Quality Requirements:
- Ultra realistic
- Commercial photography
- Luxury advertising quality
- Studio-grade lighting
- Sharp focus
- Highly detailed textures
- HDR
- 8K quality
- Magazine-quality composition
- Suitable for premium brands, social media campaigns, billboards, websites, and e-commerce.

The final image should look like it was produced by a professional advertising agency for an international luxury brand.`;

export async function POST(req: NextRequest) {
  const docId = Date.now().toString();
  let finalImageUrl = "";
  let imageBuffer: Buffer;
  let avatarBuffer: Buffer;
  let generatedImageFileId: string | undefined;

  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const imageUrl = formData.get("imageUrl") as string | null;
    const description = formData.get("description") as string;
    const size = formData.get("size") as string;
    const userEmail = formData?.get("userEmail") as string;
    const avatar = formData?.get("avatar") as string | null;
    //Save to Databse

    await setDoc(doc(db, "user-ads", docId), {
      userEmail: userEmail,
      description: description,
      size: size,
      status: "pending",
    });

    if (file instanceof File) {
      // User uploaded image

      const arrayBuffer = await file.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);

      const imageKitRef = await imagekit.upload({
        file: imageBuffer.toString("base64"),
        fileName: `${Date.now()}.png`,
        isPublished: true,
      });

      finalImageUrl = imageKitRef.url;
    } else if (imageUrl) {
      // Preset image

      finalImageUrl = imageUrl;

      const arrayBuffer = await axios.get(finalImageUrl, {
        responseType: "arraybuffer",
      });

      imageBuffer = Buffer.from(arrayBuffer.data);
    } else {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    console.log(finalImageUrl);
    console.log(imageBuffer.length);

    const [width, height] = size.split("x");
    let selectedPrompt = `${productPrompt}

        User Description:
        ${description}`;

    const cloudflareForm = new FormData();

    cloudflareForm.append(
      "input_image_1",
      new Blob([new Uint8Array(imageBuffer)], {
        type: "image/png",
      }),
      "product.png",
    );

    if (avatar) {
      const arrayBuffer = await axios.get(avatar, {
        responseType: "arraybuffer",
      });

      avatarBuffer = Buffer.from(arrayBuffer.data);

      cloudflareForm.append(
        "input_image_0",
        new Blob([new Uint8Array(avatarBuffer)], {
          type: "image/png",
        }),
        "model.png",
      );

      selectedPrompt = `${avatarPrompt}

        User Description:
        ${description}`;
    }

    cloudflareForm.append("prompt", selectedPrompt);

    cloudflareForm.append("width", width);
    cloudflareForm.append("height", height);

    console.log("Prompt:", cloudflareForm.get("prompt"));
    console.log("Width:", cloudflareForm.get("width"));
    console.log("Height:", cloudflareForm.get("height"));
    console.log(cloudflare.defaults.baseURL);
    console.log("Calling Cloudflare...");

    const aiResponse = await cloudflare.post(
      "/@cf/black-forest-labs/flux-2-klein-9b",
      cloudflareForm,
    );

    if (!aiResponse.data.success || !aiResponse.data.result?.image) {
      return NextResponse.json(
        { error: "Image generation failed" },
        { status: 500 },
      );
    }

    console.log("Cloudflare Success");

    const base64Image = aiResponse.data.result.image;

    //Upload the generated image to ImageKit
    const uploadResult = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.jpg`,
      isPublished: true,
    });

    console.log("Generated Image URL:", uploadResult.url);
    generatedImageFileId = uploadResult.fileId;

    //Update Doc
    await updateDoc(doc(db, "user-ads", docId), {
      finalProductImageUrl: uploadResult?.url,
      finalProductImageFileId: generatedImageFileId,
      productImageUrl: finalImageUrl,
      status: "completed",
    });

    return NextResponse.json({
      success: true,
      originalImage: finalImageUrl,
      generatedImage: uploadResult.url,
    });
  } catch (error) {
    try {
      await deleteDoc(doc(db, "user-ads", docId));
    } catch {}

    if (generatedImageFileId) {
      try {
        await imagekit.deleteFile(generatedImageFileId);
      } catch {}
    }

    if (axios.isAxiosError(error)) {
      console.log("Status:", error.response?.status);

      if (error.response?.data instanceof ArrayBuffer) {
        console.log(
          "Response:",
          Buffer.from(error.response.data).toString("utf-8"),
        );
      } else {
        console.log("Response:", error.response?.data);
      }
    } else {
      console.error(error);
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
