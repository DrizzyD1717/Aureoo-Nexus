"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2, CheckCircle2 } from "lucide-react";

export default function FileUpload({ userId }: { userId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");
    setSuccessMessage("");

    // Upload the file to Supabase Storage
    // Path format: {userId}/{filename} ensures RLS policies allow the upload
    const { error: uploadError } = await supabase.storage
      .from("client_assets")
      .upload(`${userId}/${file.name}`, file, {
        cacheControl: "3600",
        upsert: true, // Overwrites if a file with the same name exists
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      setError("Failed to upload file. Please try again.");
    } else {
      setSuccessMessage(`${file.name} uploaded securely.`);

      // Tell Next.js to re-fetch the server component so the new file appears in the list instantly!
      router.refresh();

      // Clear the success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    }

    setIsUploading(false);
  };

  return (
    <div className="mt-4 border-t border-obsidian-300 pt-4">
      {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
      {successMessage && (
        <div className="flex items-center gap-2 text-sm text-green-400 mb-3 bg-green-400/10 p-2 rounded-lg border border-green-400/20">
          <CheckCircle2 className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      <div className="relative group">
        <input
          type="file"
          id="file-upload"
          disabled={isUploading}
          onChange={handleUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
        />
        <div className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-obsidian-300 rounded-xl py-6 bg-obsidian-200/50 group-hover:bg-obsidian-200 group-hover:border-silver/50 transition-all">
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 text-silver animate-spin" />
              <span className="text-sm font-medium text-silver-light">
                Encrypting & Uploading...
              </span>
            </>
          ) : (
            <>
              <UploadCloud className="w-5 h-5 text-silver-dark group-hover:text-silver transition-colors" />
              <span className="text-sm font-medium text-silver-dark group-hover:text-silver-light transition-colors">
                Click or drag file to upload to vault
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
