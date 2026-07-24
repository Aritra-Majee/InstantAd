import { useAuthContext } from "@/app/provider";
import React, { useEffect, useState } from "react";
import { db } from "@/configs/firebaseConfig";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, Loader2Icon, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
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

export type PreviewProduct = {
  id: string;
  finalProductImageUrl: string;
  productImageUrl: string;
  description: string;
  size: string;
  status: string;
};

function PreviewResult() {
  const { user } = useAuthContext();
  const [productList, setProductList] = useState<PreviewProduct[]>([]);

  useEffect(() => {
    if (!user?.email) return;

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
      setProductList(matchedDocs);
    });

    return () => unSub();
  }, [user?.email]);

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
    //Toast
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

  return (
    <div>
      <h2 className="font-bold text-2xl">Generated Result</h2>

      <div className="grid grid-cols-2 mt-4 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {productList.map((product, index) => {
          return (
            <div key={index}>
              {product?.status == "completed" ? (
                <div>
                  <Image
                    key={product.id}
                    src={product.finalProductImageUrl}
                    alt={product.id}
                    width={500}
                    height={500}
                    className="w-full h-[250px] object-cover rounded-lg"
                  />
                  <div className="flex gap-3 mt-4">
                    <Link
                      href={product.finalProductImageUrl}
                      target="_blank"
                      className="flex-1"
                    >
                      <Button
                        variant="ghost"
                        className="w-full h-11 rounded-xl"
                      >
                        View
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 rounded-xl"
                      onClick={() =>
                        DownloadImage(product.finalProductImageUrl)
                      }
                    >
                      <Download className="h-5 w-5" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-11 w-11 rounded-xl hover:bg-red-500/10"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete this advertisement?
                          </AlertDialogTitle>

                          <AlertDialogDescription>
                            This action cannot be undone.
                            <br />
                            <br />
                            Your generated advertisement image will be
                            permanently deleted from your account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>

                          <AlertDialogAction
                            onClick={() => DeleteAd(product.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border rounded-xl h-[250px] bg-zinc-800">
                  <Loader2Icon className="animate-spin" />
                  <h2>Generating...</h2>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PreviewResult;
