import { useAuth } from "@/contexts/AuthContext";
import { useAppData } from "@/contexts/AppDataContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StudentCard } from "@/components/StudentCard";
import { useNavigate } from "react-router-dom";

export default function SelectedStudents() {
  const { user } = useAuth();
  const { getSelectedStudents, unselectStudent } = useAppData();
  const navigate = useNavigate();
  const selected = getSelectedStudents(user!.id);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Selected Students</h1>
          <p className="text-sm text-muted-foreground mt-1">{selected.length} student{selected.length !== 1 ? "s" : ""} in your mentorship</p>
        </div>
        {selected.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">No students selected yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {selected.map(s => (
              <StudentCard
                key={s.id}
                student={s}
                isSelected
                onUnselect={() => unselectStudent(user!.id, s.id)}
                onChat={() => navigate("/mentor/chat")}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
