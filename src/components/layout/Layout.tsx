import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="max-w-screen-xl px-4 pb-8 mx-auto lg:pb-16 lg:pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
