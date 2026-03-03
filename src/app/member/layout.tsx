import { ReactNode } from "react";
import MemberSidebar from "../../components/MemberSidebar";

export const metadata = {
  title: "Member Area - TSEDK",
};

export default function MemberLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <MemberSidebar />
      <main className="flex-1 bg-white p-8">
        {children}
      </main>
    </div>
  );
}
