"use client";

import { getAllPosts, getAllReports, PostWithUser } from "@/lib/api/admin";
import { useQuery } from "@tanstack/react-query";
import PostCard from "./PostCard";
import { AdminViewType } from "@/lib/util/types";
import { ReportType } from "@freebites/freebites-types";
import { useEffect, useState } from "react";
import { ReportCategory } from "@freebites/freebites-types/dist/ReportTypes";
import { groupByMap } from "@/lib/util/backend";
import ReportCard from "./ReportCard";

interface AdminPostListProps {
  viewState: AdminViewType;
}

const AdminPostList = (props: AdminPostListProps) => {
  const { viewState } = props;
  // State to store aggregated data
  const [postData, setPostData] = useState<PostWithUser[]>([]);
  const [reportData, setReportData] = useState<ReportType[]>([]);
  const [groupedReportData, setGroupedReportData] = useState<
    Map<string, ReportType[]>
  >(new Map());
  // All hooks run on every render, but only the enabled one fetches
  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
    enabled: viewState === AdminViewType.POSTS,
  });

  const postReportsQuery = useQuery({
    queryKey: ["post-reports"],
    queryFn: () => getAllReports(ReportCategory.POST),
    enabled: viewState === AdminViewType.POST_REPORTS,
  });

  const commentReportsQuery = useQuery({
    queryKey: ["comment-reports"],
    queryFn: () => getAllReports(ReportCategory.COMMENT),
    enabled: viewState === AdminViewType.COMMENT_REPORTS,
  });

  const userReportsQuery = useQuery({
    queryKey: ["user-reports"],
    queryFn: () => getAllReports(ReportCategory.USER),
    enabled: viewState === AdminViewType.USER_REPORTS,
  });

  // Get the active query data
  const activeQuery = (() => {
    switch (viewState) {
      case AdminViewType.POSTS:
        return postsQuery;
      case AdminViewType.POST_REPORTS:
        return postReportsQuery;
      case AdminViewType.COMMENT_REPORTS:
        return commentReportsQuery;
      case AdminViewType.USER_REPORTS:
        return userReportsQuery;
      default:
        return postsQuery;
    }
  })();

  const { data, error, isLoading } = activeQuery;
  // group by using Map for better type safety with complex keys

  useEffect(() => {
    if (data) {
      switch (viewState) {
        case AdminViewType.POSTS:
          const allPostData = data as PostWithUser[]; // cast to posts
          setPostData(allPostData);
          setReportData([]);
          break;
        case AdminViewType.POST_REPORTS:
          const postReports = data as ReportType[];
          const groupedPostReports = groupByMap(
            postReports,
            (report) => report.postID
          );
          setPostData([]);
          setReportData(postReports);
          setGroupedReportData(groupedPostReports);
          break;
        case AdminViewType.COMMENT_REPORTS:
          const commentReports = data as ReportType[];
          setPostData([]);
          setReportData(commentReports);
          break;
        case AdminViewType.USER_REPORTS:
          const userReports = data as ReportType[];
          const groupedUserReports = groupByMap(
            userReports,
            (report) => report.defendentID
          );

          setPostData([]);
          setReportData(userReports);
          setGroupedReportData(groupedUserReports);
          break;
        default:
          const postData = data as PostWithUser[]; // cast to posts
          setPostData(postData);
          setReportData([]);
          break;
      }
    }
  }, [data, viewState]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  switch (viewState) {
    case AdminViewType.POSTS:
      return (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(20rem,_1fr))] gap-20 mt-11">
          {postData.map((post) => {
            const postKey = post._id ?? `${post.title}-${post.locationName}`;
            return <PostCard post={post} key={postKey} />;
          })}
        </div>
      );
    case AdminViewType.POST_REPORTS:
      return (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(20rem,_1fr))] gap-20 mt-11">
          {Array.from(groupedReportData.entries()).map(([postID, reports]) => (
            <ReportCard
              key={postID}
              category={ReportCategory.POST}
              reportedID={postID}
              reports={reports}
            />
          ))}
        </div>
      );

    case AdminViewType.USER_REPORTS:
      return (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(20rem,_1fr))] gap-20 mt-11">
          {Array.from(groupedReportData.entries()).map(([userID, reports]) => (
            <ReportCard
              key={userID}
              category={ReportCategory.USER}
              reportedID={userID}
              reports={reports}
            />
          ))}
        </div>
      );

    case AdminViewType.COMMENT_REPORTS:
      return (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(20rem,_1fr))] gap-20 mt-11">
          {reportData.map((commentReport) => {
            return <div key={commentReport._id}>{commentReport._id}</div>;
          })}
        </div>
      );
    default:
      return null;
  }
};

export default AdminPostList;
