import AdminSidebar from "./AdminSidebar";

export const metadata = {
  title: "Admin — PrimNord Granit",
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-stone-100">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="min-h-full p-8">{children}</div>
      </main>
    </div>
  );
}
