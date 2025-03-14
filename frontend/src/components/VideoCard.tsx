"use client";

import { useCallback } from "react";
import { getYoutubeId } from "@/lib/utils";
import { Video } from "@/types";

export default function VideoCard({ video }: { video: Video }) {
  const baseUrl = process.env.NEXT_PUBLIC_YOUTUBE_THUMB_URL;

  const getThumbnail = useCallback(() => {
    const id = getYoutubeId(video.videoUrl);
    return id ? `${baseUrl}/vi/${id}/hqdefault.jpg` : null;
  }, [video.videoUrl, baseUrl]);

  const thumbnail = getThumbnail();

  return (
    <div className="mb-4 p-4 border border-gray-200 rounded shadow-sm">
      <h3 className="text-xl font-bold">{video.title}</h3>
      <p className="text-sm text-gray-600">Shared by: {video.sharedBy}</p>

      {thumbnail ? (
        <a
          href={video.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block my-2"
        >
          <img
            src={thumbnail}
            alt={video.title}
            className="w-20 h-20 object-cover rounded"
          />
        </a>
      ) : (
        <p className="text-red-500">Unable to fetch thumbnail.</p>
      )}

      <a
        href={video.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        Watch Video
      </a>
    </div>
  );
}
