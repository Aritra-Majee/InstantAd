import { NextRequest, NextResponse } from "next/server";
import imagekit from "@/lib/imagekit";
import { db } from "@/configs/firebaseConfig";
import { deleteDoc, doc, getDoc } from "firebase/firestore";

export async function DELETE(req: NextRequest) {
  try {
    const { docId } = await req.json();

    if (!docId) {
      return NextResponse.json(
        { success: false, message: "Document ID is required." },
        { status: 400 }
      );
    }

    // Get Firestore document
    const docRef = doc(db, "user-ads", docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { success: false, message: "Ad not found." },
        { status: 404 }
      );
    }

    const data = docSnap.data();
    const fileId = data.finalProductImageFileId;

    // Delete ImageKit image
    if (fileId) {
      try {
        await imagekit.deleteFile(fileId);
      } catch (error) {
        console.error("ImageKit deletion failed:", error);
      }
    }

    // Delete Firestore document
    await deleteDoc(docRef);

    return NextResponse.json({
      success: true,
      message: "Ad deleted successfully.",
    });
  } catch (error) {
    console.error("Delete ad error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete ad.",
      },
      { status: 500 }
    );
  }
}