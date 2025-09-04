"use client";
import React, { useState } from "react";
import Navbar from "../Navbar";
import AdminHeader from "./AdminHeader";
import { AdminViewType } from "@/lib/util/types";
import AdminTableHeader from "./AdminTableHeader";
import {
  getReportsGroupedByComments,
  getReportsGroupedByPost,
  getReportsGroupedByUser,
} from "@/lib/api/admin/reports";
// import CommonButton from "../common/CommonButton";
import PostReportTable from "./TableComponents/PostReportTable";
import CommentReportTable from "./TableComponents/CommentReportTable";
import UserReportTable from "./TableComponents/UserReportTable";
import { useQuery } from "@tanstack/react-query";

function AdminPage() {
  const [adminViewState, setAdminViewState] = useState<AdminViewType>(
    AdminViewType.POST_REPORTS
  );

  // temporary data fetching, not optimal
  const { data: postReports, isLoading: postReportsLoading } = useQuery({
    queryKey: ["postReports"],
    queryFn: getReportsGroupedByPost,
  });

  const { data: commentReports, isLoading: commentReportsLoading } = useQuery({
    queryKey: ["commentReports"],
    queryFn: getReportsGroupedByComments,
  });

  const { data: userReports, isLoading: userReportsLoading } = useQuery({
    queryKey: ["userReports"],
    queryFn: getReportsGroupedByUser,
  });

  return (
    <>
      <div className=" bg-orange-faint">
        <Navbar />
      </div>
      <div className="bg-orange-faint min-h-screen min-w-screen pt-16 lg:pt-32">
        {/* <CommonButton
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
        /> */}
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

          {adminViewState === AdminViewType.USER_REPORTS && userReports && (
            <UserReportTable reports={userReports} />
          )}
          {adminViewState === AdminViewType.COMMENT_REPORTS &&
            commentReports && <CommentReportTable reports={commentReports} />}

          {adminViewState === AdminViewType.POSTS && <div> all posts TBD </div>}
        </div>
      </div>
    </>
  );
}

export default AdminPage;
