import { PostWithUser } from "@/lib/api/admin";
import CommonButton from "../common/CommonButton";
// import Image from "next/image";
interface PostCardProps {
  post: PostWithUser;
}
const PostCard = (props: PostCardProps) => {
  const { post } = props;

  return (
    <div className="flex flex-col bg-white rounded-4xl max-w-md items-center">
      {/* <Image src={""} alt={""}></Image> */}
      <div className="w-96 h-60 rounded-2xl mx-11 my-12 bg-amber-200" />
      <div className="w-full">
        <h1 className="font-inter text-2xl font-medium mx-11">
          {post.locationName}
        </h1>
        <p className="font-inter text-lg mx-11">{post.description}</p>
        <div className="flex flex-row justify-between mt-11 mb-8 mx-11">
          <p>{post.posterInfo?.firstName + " " + post.posterInfo?.lastName}</p>
          <p>{post.postTime.toLocaleDateString()}</p>
        </div>
      </div>
      <div className="w-full px-11">
        <CommonButton
          label={"Delete Post"}
          altStyle="w-full bg-[#FF9529] border-0 py-3 mt-11 mb-16"
          altTextStyle="font-inter text-white text-lg font-medium"
        />
      </div>
    </div>
  );
};
export default PostCard;
