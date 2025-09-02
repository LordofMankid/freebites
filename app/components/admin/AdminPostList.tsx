"use client";

import { getAllPosts, getAllReports, PostWithUser } from "@/lib/api/admin";
import { useQuery } from "@tanstack/react-query";
import PostCard from "./PostCard";
import { AdminViewType } from "@/lib/util/types";
import { ReportType } from "@freebites/freebites-types";
import { useEffect, useMemo, useState } from "react";
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
  // All hooks run on every render, but only the enabled one fetches
  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
    enabled: viewState === AdminViewType.POSTS,
  });

  const postReportsQuery = useQuery({
    queryKey: ["post-reports"],
    queryFn: async () => {
      try {
        return await getAllReports(ReportCategory.POST);
      } catch {
        return [];
      }
    },
    enabled: viewState === AdminViewType.POST_REPORTS,
  });

  const commentReportsQuery = useQuery({
    queryKey: ["comment-reports"],
    queryFn: async () => {
      try {
        return await getAllReports(ReportCategory.COMMENT);
      } catch {
        return [];
      }
    },
    enabled: viewState === AdminViewType.COMMENT_REPORTS,
  });

  const userReportsQuery = useQuery({
    queryKey: ["user-reports"],
    queryFn: async () => {
      try {
        return await getAllReports(ReportCategory.USER);
      } catch {
        return [];
      }
    },
    enabled: viewState === AdminViewType.USER_REPORTS,
  });

  // reported posts:"
  /*
[
  {
    postInfo: {...postInfo} PostType
    defendant: {...userInfo} UserType
    reportsWithUsers: {report: ReportType, reporter: UserType}[]
  },
  {
    postInfo: {...postInfo} PostType
    defendant: {...userInfo} UserType
    reportsWithUsers: {report: ReportType, reporter: UserType}[]
  },
]

// reported users:
[
  {
    reportedUser: UserType
    reportsWithUsers: {report: ReportType, reporter: UserType}[]
  },
]
// reported comments:
[
  {
    commentInfo: {...commentInfo} CommentType
    defendant: {...userInfo} UserType
    reportsWithUsers: {report: ReportType, reporter: UserType}[]
  },
]
  

routes:
- report
  - [id]
  - bulk
  - count
  [new]:
  - report
  - comment
  - user
  
*/
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

  const groupedReportData = useMemo(() => {
    if (!reportData || reportData.length === 0) return new Map();

    const reports = data as unknown as ReportType[];
    switch (viewState) {
      case AdminViewType.POST_REPORTS:
        return groupByMap(reports, (report) => report.postID);
      case AdminViewType.USER_REPORTS:
        // const userReports = data as ReportType[];
        return groupByMap(reports, (report) => report.defendentID);
      default:
        return new Map();
    }
  }, [viewState, reportData, data]);

  useEffect(() => {
    if (data) {
      switch (viewState) {
        case AdminViewType.POSTS:
          const allPostData = data as PostWithUser[]; // cast to posts
          setPostData(allPostData);
          setReportData([]);
          break;
        case AdminViewType.POST_REPORTS:
          const postReports = data as unknown as ReportType[];
          setPostData([]);
          setReportData(postReports);
          break;
        case AdminViewType.COMMENT_REPORTS:
          const commentReports = data as unknown as ReportType[];
          setPostData([]);
          setReportData(commentReports);
          break;
        case AdminViewType.USER_REPORTS:
          const userReports = data as unknown as ReportType[];

          setPostData([]);
          setReportData(userReports);
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
  if (error) return <div>Error loading posts: {error.toString()}</div>;

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
        <table className="w-full">
          <thead className="bg-[#FFE0C0] text-left [&>tr>th]:font-inter [&>tr>th]:font-normal [&>tr>th]:py-2">
            <tr>
              <th className="pl-6 rounded-l-xl">Date</th>
              <th>Image</th>
              <th>Message</th>
              <th>Sender</th>
              <th>Reciever</th>
              <th className="rounded-r-xl">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(groupedReportData.entries()).map(
              ([postID, reports]) => (
                <ReportCard
                  key={postID}
                  category={ReportCategory.POST}
                  reportedID={postID}
                  reports={reports}
                />
              )
            )}
          </tbody>
        </table>
      );

    case AdminViewType.USER_REPORTS:
      return (
        <table className="w-full">
          <thead className="bg-[#FFE0C0] text-left [&>tr>th]:font-inter [&>tr>th]:font-normal [&>tr>th]:py-2">
            <tr>
              <th className="pl-6 py-2 rounded-l-xl">Date</th>
              <th>Reported User</th>
              <th>Reporter</th>
              <th>Reporter&apos;s Message</th>
              <th className="rounded-r-xl">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(groupedReportData.entries()).map(
              ([userID, reports]) => (
                <ReportCard
                  key={userID}
                  category={ReportCategory.USER}
                  reportedID={userID}
                  reports={reports}
                />
              )
            )}
          </tbody>
        </table>
      );

    case AdminViewType.COMMENT_REPORTS:
      return (
        <table>
          <thead className="bg-[#FFE0C0] text-left [&>tr>th]:font-inter [&>tr>th]:font-normal [&>tr>th]:py-2">
            <tr>
              <th className="pl-6 py-2 rounded-l-xl">Date</th>
              <th>Reported Comment</th>
              <th>Commenter</th>
              <th>Reporter</th>
              <th>Message</th>
              <th className="rounded-r-xl">Action</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((commentReport) => {
              return (
                <ReportCard
                  key={commentReport._id}
                  category={ReportCategory.COMMENT}
                  reports={[commentReport]}
                  reportedID={commentReport.postID}
                />
              );
            })}
          </tbody>
        </table>
      );
    default:
      return null;
  }
};

export default AdminPostList;
