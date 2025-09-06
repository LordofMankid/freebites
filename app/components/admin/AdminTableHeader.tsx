import { getReportCountByCategory } from "@/lib/api/admin/reports";
import { AdminViewType } from "@/lib/util/types";
import { ReportCategory } from "@freebites/freebites-types";
import { useQuery } from "@tanstack/react-query";
interface AdminTableHeaderProps {
  viewState: AdminViewType;
  setViewState: (arg0: AdminViewType) => void;
  adminSchoolSelection: string;
}

const AdminTableHeader = (props: AdminTableHeaderProps) => {
  const { viewState, setViewState, adminSchoolSelection } = props;

  const reportCountQuery = useQuery({
    queryKey: ["all-report-counts", adminSchoolSelection],
    queryFn: async () => {
      const counts = await Promise.all([
        { viewType: AdminViewType.POSTS, count: 0 }, // Or getPostsCount()
        {
          viewType: AdminViewType.POST_REPORTS,
          count: await getReportCountByCategory(
            adminSchoolSelection,
            ReportCategory.POST
          ),
        },
        {
          viewType: AdminViewType.COMMENT_REPORTS,
          count: await getReportCountByCategory(
            adminSchoolSelection,
            ReportCategory.COMMENT
          ),
        },
        {
          viewType: AdminViewType.USER_REPORTS,
          count: await getReportCountByCategory(
            adminSchoolSelection,
            ReportCategory.USER
          ),
        },
      ]);
      return counts.reduce(
        (acc, item) => {
          acc[item.viewType] = item.count;
          return acc;
        },
        {} as Record<AdminViewType, number>
      );
    },
  });

  const getCountDisplayText = (viewType: AdminViewType) => {
    if (viewType === AdminViewType.POSTS) {
      return viewType;
    }

    const count = reportCountQuery.isLoading
      ? 0
      : reportCountQuery.data?.[viewType] || 0;
    return `${viewType} (${count})`;
  };

  return (
    <>
      <div className="flex gap-8">
        {Object.values(AdminViewType).map((viewType) => {
          return (
            <div
              onClick={() => setViewState(viewType as AdminViewType)}
              key={viewType}
              className="relative cursor-pointer"
            >
              <p
                className={`font-inter text-lg text-neutral-light-text ${viewType === viewState ? "text-orange-600 font-bold" : ""}`}
              >
                {getCountDisplayText(viewType)}
              </p>
              <div
                className={`h-0.5 w-full bg-orange-600 absolute bottom-0 left-0 right-0 translate-y-4 ${viewType === viewState ? "opacity-100" : "opacity-0"}`}
              />
            </div>
          );
        })}
      </div>
      <hr className="border-t border-gray-300 mt-4" />
    </>
  );
};

export default AdminTableHeader;
