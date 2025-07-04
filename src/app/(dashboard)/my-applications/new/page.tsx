// src/app/(dashboard)/my-applications/new/page.tsx

import NewApplicationForm from "@/components/NewApplicationForm";


export default function NewApplicationPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Nueva Postulación</h1>
      <NewApplicationForm />
    </div>
  );
}
