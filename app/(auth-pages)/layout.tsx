import PendingModal from "@/components/pending-modal";
import Logo from "../../components/logo";

// app/(dashboard)/layout.tsx (for dashboard route)
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-row">
      <div className="flex-1 bg-black flex items-center justify-center">
        <div className="w-60">
          <Logo />
        </div>
      </div>
      <div className="flex-1 flex bg-black border-l items-center justify-center">
        {children}
      </div>
    </div>
  );
}
