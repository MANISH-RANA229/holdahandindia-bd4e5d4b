/**
 * StudentDiscovery — Uses react-virtuoso for virtual scrolling
 * and useMemo for memoized student data.
 */
import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StudentCard } from "@/components/StudentCard";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { VirtuosoGrid } from "react-virtuoso";

export default function StudentDiscovery() {
  const { user } = useAuth();
  const { students, selectStudent, unselectStudent, isStudentSelected } = useAppData();
  const { toast } = useToast();
  const navigate = useNavigate();

  /** Memoize the student list to avoid re-computation on unrelated state changes */
  const studentList = useMemo(() => students, [students]);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Discover Students</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse student profiles and select those you'd like to mentor</p>
        </div>

        {/* Virtual scrolling grid — renders only visible items */}
        <VirtuosoGrid
          totalCount={studentList.length}
          useWindowScroll
          listClassName="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          itemContent={(index) => {
            const s = studentList[index];
            return (
              <StudentCard
                key={s.id}
                student={s}
                isSelected={isStudentSelected(user!.id, s.id)}
                onSelect={() => {
                  selectStudent(user!.id, s.id);
                  toast({ title: "Student selected", description: `${s.name} added to your mentorship list.` });
                }}
                onDeselect={() => {
                  unselectStudent(user!.id, s.id);
                  toast({ title: "Student removed", description: `${s.name} removed from your list.` });
                }}
                onViewInsights={() => navigate("/mentor/insights")}
              />
            );
          }}
        />
      </div>
    </DashboardLayout>
  );
}
