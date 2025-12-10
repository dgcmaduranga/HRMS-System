// src/pages/admin/SupportPage.jsx
import AdminLayout from "../../layouts/AdminLayout";

export default function SupportPage() {
  return (
    <AdminLayout>
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm border p-6">
        <h1 className="text-xl font-semibold mb-2">Contact Support</h1>
        <p className="text-sm text-slate-600 mb-4">
          If you face any issues with the HRMS Portal, contact the system
          administrator using the details below.
        </p>

        <div className="space-y-3 text-sm">
          <p>
            <span className="font-semibold">Email:</span>{" "}
            support@hrms-portal.com
          </p>
          <p>
            <span className="font-semibold">Phone:</span> +94 77 123 4567
          </p>
          <p>
            <span className="font-semibold">Office Hours:</span> Mon–Fri,
            9.00am–5.00pm
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
