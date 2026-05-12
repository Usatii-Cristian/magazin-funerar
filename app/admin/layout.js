import AdminLayoutClient from "./AdminLayoutClient";

export const metadata = {
  title: "Admin — GranitNord Elit CV",
};

export default function AdminLayout({ children }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
