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
import PostReportTable from "./TableComponents/PostReportTable";
import CommentReportTable from "./TableComponents/CommentReportTable";
import UserReportTable from "./TableComponents/UserReportTable";
import { useQuery } from "@tanstack/react-query";

function AdminPage() {
  const [adminViewState, setAdminViewState] = useState<AdminViewType>(
    AdminViewType.POST_REPORTS,
  );
  const [adminSchool, setAdminSchool] = useState<string>("All Schools");

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
          <AdminHeader
            adminSchoolSelection={adminSchool}
            setAdminSchoolSelection={setAdminSchool}
          />
          <hr className="border-t border-gray-300 mt-8 mb-5" />
          <AdminTableHeader
            viewState={adminViewState}
            setViewState={setAdminViewState}
            adminSchoolSelection={adminSchool}
          />
          {adminViewState === AdminViewType.POST_REPORTS && postReports && (
            <PostReportTable
              reports={
                adminSchool === "All Schools"
                  ? postReports
                  : postReports.filter((report) => {
                      return (
                        (report.postInfo?.school as string) === adminSchool
                      );
                    })
              }
            />
          )}

          {adminViewState === AdminViewType.USER_REPORTS && userReports && (
            <UserReportTable
              reports={
                adminSchool === "All Schools"
                  ? userReports
                  : userReports.filter((report) => {
                      return (
                        (report.reportedUser?.school as string) === adminSchool
                      );
                    })
              }
            />
          )}
          {adminViewState === AdminViewType.COMMENT_REPORTS &&
            commentReports && (
              <CommentReportTable
                reports={
                  adminSchool === "All Schools"
                    ? commentReports
                    : commentReports.filter((report) => {
                        return (
                          (report.defendent?.school as string) === adminSchool
                        );
                      })
                }
              />
            )}

          {adminViewState === AdminViewType.POSTS && <div> all posts TBD </div>}
        </div>
      </div>
    </>
  );
}

export default AdminPage;
