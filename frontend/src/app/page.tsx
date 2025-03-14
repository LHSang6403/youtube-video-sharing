"use client";

import { useCallback, useEffect, useContext } from "react";
import { useQuery } from "@apollo/client";
import { GET_VIDEOS } from "@/graphql/operations";
import { useRouter } from "next/navigation";
import { SocketContext } from "@/components/ClientProvider";
import VideoCard from "@/components/VideoCard";
import { Video } from "@/types";

export default function HomePage() {
  const router = useRouter();
  const socket = useContext(SocketContext);

  const { loading, error, data, refetch } = useQuery<{ videos: Video[] }>(
    GET_VIDEOS
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!socket) return;

    const handleNewVideo = () => {
      refetch();
    };

    socket.on("newVideo", handleNewVideo);
    return () => {
      socket.off("newVideo", handleNewVideo);
    };
  }, [socket, refetch]);

  const handleShare = useCallback(() => {
    router.push("/share");
  }, [router]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    router.push("/login");
  }, [router]);

  if (loading) return <p>Loading video list...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="flex justify-end space-x-2 mb-4">
        <button
          onClick={handleShare}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Share Video
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Video List</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
