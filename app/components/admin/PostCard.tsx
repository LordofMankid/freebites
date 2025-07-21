"use client";
import { deletePost, PostWithUser } from "@/lib/api/admin";
import CommonButton from "../common/CommonButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchImageURL } from "@/lib/util/backend";
import Image from "next/image";
import { useCallback } from "react";
interface PostCardProps {
  post: PostWithUser;
}
const PostCard = (props: PostCardProps) => {
  const { post } = props;

  const pathToFirstImage = post.imageURIs[0];

  const {
    data: imageURL,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["postImage", pathToFirstImage],
    queryFn: () => fetchImageURL(pathToFirstImage),
    enabled: !!pathToFirstImage,
  });

  const queryClient = useQueryClient();

  const deletePostCallback = useCallback(async () => {
    await deletePost(post._id);

    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }, [post._id, queryClient]);

  return (
    <div className="flex flex-col w-full relative bg-white rounded-4xl max-w-md items-center px-9">
      {error || isLoading ? (
        <div className="w-96 h-60 rounded-2xl my-9 bg-neutral-lighter-text" />
      ) : (
        <div className="relative w-full h-60 my-9">
          <Image
            src={imageURL ?? "hi"}
            alt="yuh"
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover rounded-2xl"
          />
        </div>
      )}

      <div className="w-full">
        <h1 className="font-inter text-2xl font-medium line-clamp-1">
          {post.locationName}
        </h1>
        <p className="font-inter text-lg">{post.description}</p>
        <div className="flex flex-row justify-between mt-8 mb-8">
          <p>{post.posterInfo?.firstName + " " + post.posterInfo?.lastName}</p>
          <p>{post.postTime.toLocaleDateString()}</p>
        </div>
      </div>
      <div className="w-full">
        <CommonButton
          label={"Delete Post"}
          altStyle="w-full bg-[#FF9529] border-0 py-3 mt-11 mb-16"
          altTextStyle="font-inter text-white text-lg font-medium"
          onClick={deletePostCallback}
        />
      </div>
    </div>
  );
};
export default PostCard;
