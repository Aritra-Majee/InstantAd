"use client";
import { useAuthContext } from "@/app/provider";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { PreviewProduct } from "../../creative-ai-tools/_componenets/PreviewResult";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";
import Link from "next/link";
import { Download, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";

function UsersAdsList() {
  const [adsList, setAdsList] = useState<PreviewProduct[]>([]);
  const { user } = useAuthContext();

  const DownloadImage = async (imageUrl: string) => {
    const result = await fetch(imageUrl);
    const blob = await result.blob();

    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.setAttribute("download", "InstantAd");

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(blobUrl);
    toast.success("Image downloaded successfully!");
  };

  const DeleteAd = async (docId: string) => {
  try {
    const res = await fetch("/api/delete-ad", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ docId }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Ad deleted successfully!");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete ad.");
  }
};

  useEffect(() => {
    if (!user?.email) {
      setAdsList([]);
      return;
    }

    const q = query(
      collection(db, "user-ads"),
      where("userEmail", "==", user?.email),
    );

    const unSub = onSnapshot(q, (querySnapshot) => {
      const matchedDocs: any = [];
      querySnapshot.forEach((doc) => {
        matchedDocs.push({ id: doc.id, ...doc.data() });
      });
      console.log(matchedDocs);
      setAdsList(matchedDocs);
    });

    return () => unSub();
  }, [user?.email]);

  return (
    <div>
      <h2 className="font-bold text-2xl mb-2 mt-5">My Ads</h2>
      {adsList?.length == 0 && (
        <div className="p-5 border-dashed border-2 rounded-2xl flex flex-col items-center justify-center mt-6 gap-3">
          <Image
            src={"/signboard.png"}
            alt="empty"
            width={200}
            height={200}
            className="w-20"
          />

          <h2>You don't have any ads created</h2>
          <Link href="/creative-ai-tools/product-images">
            <Button>Create New Ads</Button>
          </Link>
        </div>
      )}

      <div className="grid gird-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {adsList.map((adsList, index) => (
          <div key={index}>
            <Image
              src={adsList.finalProductImageUrl}
              alt={adsList.finalProductImageUrl}
              width={400}
              height={400}
              className="w-full h-[250px] lg:h-[370px] object-cover rounded-xl"
            />
            <div className="flex items-center gap-2 mt-3">
              <Link
                href={adsList.finalProductImageUrl}
                target="_blank"
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  View
                </Button>
              </Link>

              <Button
                variant="outline"
                size="icon"
                onClick={() => DownloadImage(adsList.finalProductImageUrl)}
              >
                <Download className="h-5 w-5" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this ad?</AlertDialogTitle>

                    <AlertDialogDescription>
                      This action cannot be undone. The generated image will be
                      permanently deleted from your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                      onClick={() => DeleteAd(adsList.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersAdsList;
