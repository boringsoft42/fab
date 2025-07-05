&ldquo;use client&rdquo;;

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=&ldquo;container mx-auto py-8 md:py-10&rdquo;>
      <div className=&ldquo;flex flex-col gap-8&rdquo;>{children}</div>
    </div>
  );
}
