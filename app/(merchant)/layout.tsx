import { NavbarComponent } from "@/components/Navbar";

export default function MerchantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mt-2 w-8/12 mx-auto">
      <div className="dark:bg-white bg-black backdrop-blur-sm rounded-2xl overflow-hidden border dark:border-black/[0.2] border-white/[0.2] shadow-xl">
        <div className="p-3 mx-8">
          <NavbarComponent />
        </div>
      </div>
      {children}
    </div>
  );
}
