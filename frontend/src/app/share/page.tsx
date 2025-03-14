"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { SHARE_VIDEO_MUTATION } from "@/graphql/operations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SharePage() {
  const [form, setForm] = useState({ videoUrl: "", title: "" });
  const router = useRouter();
  const [shareVideo, { error }] = useMutation(SHARE_VIDEO_MUTATION);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const response = await shareVideo({
          variables: { shareVideoInput: form },
        });
        if (response.data?.shareVideo.id) {
          router.push("/");
        }
      } catch (err) {
        console.error(err);
      }
    },
    [form, shareVideo, router]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Share Video</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <Input
          name="videoUrl"
          type="text"
          placeholder="Video URL"
          value={form.videoUrl}
          onChange={handleChange}
        />
        <Input
          name="title"
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <Button type="submit">Share</Button>
      </form>
      {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}
    </div>
  );
}
