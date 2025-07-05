// src/app/(dashboard)/my-applications/new/page.tsx

import NewApplicationForm from &ldquo;@/components/NewApplicationForm&rdquo;;


export default function NewApplicationPage() {
  return (
    <div className=&ldquo;max-w-4xl mx-auto py-10 px-4&rdquo;>
      <h1 className=&ldquo;text-2xl font-bold mb-4&rdquo;>Nueva Postulación</h1>
      <NewApplicationForm />
    </div>
  );
}
