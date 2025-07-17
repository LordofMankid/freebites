"use client";

import { getAllPosts } from "@/lib/api/admin";
import { useQuery } from "@tanstack/react-query";
import PostCard from "./PostCard";

const AdminPostList = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  return (
    <div className="grid grid-cols-3 gap-20 mt-11">
      {data?.map((post) => {
        const postKey = post._id ?? `${post.title}-${post.locationName}`;
        return <PostCard post={post} key={postKey} />;
      })}
    </div>
  );
};

export default AdminPostList;
