"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import AdminHeader from "./AdminHeader";
import {
  AdminViewType,
  GroupedCommentReports,
  GroupedPostReports,
} from "@/lib/util/types";
import AdminTableHeader from "./AdminTableHeader";
import {
  getReportsGroupedByComments,
  getReportsGroupedByPost,
  getReportsGroupedByUser,
} from "@/lib/api/admin/reports";
import CommonButton from "../common/CommonButton";
import PostReportTable from "./TableComponents/PostReportTable";
import CommentReportTable from "./TableComponents/CommentReportTable";

function AdminPage() {
  const [adminViewState, setAdminViewState] = useState<AdminViewType>(
    AdminViewType.POST_REPORTS
  );

  const [postReports, setPostReports] = useState<GroupedPostReports[] | null>(
    null
  );

  useEffect(() => {
    const getContent = async () => {
      if (postReports) return;
      const reports = await getReportsGroupedByPost();
      setPostReports(reports);
    };
    getContent();
  }, [postReports]);

  const [commentReports, setCommentReports] = useState<
    GroupedCommentReports[] | null
  >(null);

  useEffect(() => {
    const getContent = async () => {
      if (commentReports) return;
      const reports = await getReportsGroupedByComments();
      setCommentReports(reports);
    };
    getContent();
  }, [commentReports]);

  return (
    <>
      <div className=" bg-orange-faint">
        <Navbar />
      </div>
      <div className="bg-orange-faint min-h-screen min-w-screen pt-16 lg:pt-32">
        <CommonButton
          onClick={async () => {
            const reports = await getReportsGroupedByPost();
            console.log(reports);
          }}
          label={"get reports by post"}
        />
        <CommonButton
          onClick={async () => {
            const reports = await getReportsGroupedByUser();
            console.log(reports);
          }}
          label={"get reports by user"}
        />
        <CommonButton
          onClick={async () => {
            const commentReports = await getReportsGroupedByComments();
            console.log(commentReports);
          }}
          label={"get reports by comments"}
        />
        <div className="mx-20 mt-16">
          <AdminHeader school="Tufts University" />
          <hr className="border-t border-gray-300 mt-8 mb-5" />
          <AdminTableHeader
            viewState={adminViewState}
            setViewState={setAdminViewState}
          />
          {adminViewState === AdminViewType.POST_REPORTS && postReports && (
            <PostReportTable reports={postReports} />
          )}

          {adminViewState === AdminViewType.USER_REPORTS && (
            <div>user reports here [WIP]</div>
          )}
          {adminViewState === AdminViewType.COMMENT_REPORTS &&
            commentReports && <CommentReportTable reports={commentReports} />}

          {adminViewState === AdminViewType.POSTS && (
            <div>all posts here [WIP]</div>
          )}

          {/* <AdminPostList viewState={adminViewState} /> */}
        </div>
      </div>
    </>
  );
}

export default AdminPage;
