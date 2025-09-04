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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: postReports, isLoading: postReportsLoading } = useQuery({
    queryKey: ["postReports"],
    queryFn: getReportsGroupedByPost,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: commentReports, isLoading: commentReportsLoading } = useQuery({
    queryKey: ["commentReports"],
    queryFn: getReportsGroupedByComments,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        <div className="mx-20 mt-16">
          <AdminHeader />
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
