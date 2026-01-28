import { ReactNode, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Garden } from "../../Entities/Garden";
import { Plot } from "../../Entities/Plot";
import { Sprout, Search, BookOpen, LayoutDashboard, Settings, LogOut, Menu, Building2, Shield } from "lucide-react";

// --- Inline Components ---
const Button = ({ children, className = "", variant, size, ...props }: any) => (
  <button {...props} className={`px-3 py-1 rounded ${className}`}>
    {children}
  </button>
);

const Avatar = ({ children, className = "" }: any) => (
  <div className={`rounded-full overflow-hidden ${className}`}>{children}</div>
);

const AvatarFallback = ({ children, className = "" }: any) => (
  <div className={`flex items-center justify-center w-full h-full bg-gray-200 ${className}`}>{children}</div>
);

// Very basic dropdown menu
const DropdownMenu = ({ children }: any) => <div className="relative">{children}</div>;
const DropdownMenuTrigger = ({ asChild, children }: any) => <div>{children}</div>;
const DropdownMenuContent = ({ children, className = "" }: any) => (
  <div className={`absolute right-0 mt-2 bg-white border rounded shadow-lg ${className}`}>{children}</div>
);
const DropdownMenuItem = ({ children, asChild, onClick, className = "" }: any) => (
  <div onClick={onClick} className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${className}`}>
    {children}
  </div>
);
const DropdownMenuSeparator = () => <hr className="my-1 border-gray-200" />;

// Very basic sheet for mobile menu
const Sheet = ({ children }: any) => <div>{children}</div>;
const SheetTrigger = ({ asChild, children }: any) => <div>{children}</div>;
const SheetContent = ({ children, className = "" }: any) => <div className={`fixed top-0 right-0 h-full bg-white shadow ${className}`}>{children}</div>;

// --- Layout ---
interface RootLayoutProps {
  children: ReactNode;
  currentPageName?: string;
}

interface User {
  full_name: string;
  email: string;
  platform_role: string;
}

export default function RootLayout({ children, currentPageName }: RootLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await Promise.resolve({ full_name: "John Doe", email: "john@example.com", platform_role: "member" });
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

  const publicNavItems = [
    { label: "Find Gardens", page: "GardenFinder", icon: Search },
    { label: "Resources", page: "PublicResources", icon: BookOpen },
  ];

  const getDashboardPage = () => {
    if (!user) return null;
    switch (user.platform_role) {
      case "platform_admin":
        return { label: "Platform Admin", page: "PlatformAdmin", icon: Shield };
      case "city_admin":
        return { label: "City Dashboard", page: "CityDashboard", icon: Building2 };
      case "organizer":
        return { label: "Garden Admin", page: "OrganizerDashboard", icon: Settings };
      case "member":
      default:
        return { label: "Dashboard", page: "MemberDashboard", icon: LayoutDashboard };
    }
  };

  const dashboardItem = getDashboardPage();

  const NavItems = ({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) => (
    <>
      {publicNavItems.map((item) => (
        <Link
          key={item.page}
          to={`/${item.page}`}
          className={`flex items-center gap-2 font-medium transition-colors ${
            currentPageName === item.page ? "text-emerald-600" : "text-slate-600 hover:text-emerald-600"
          } ${mobile ? "py-3 text-lg" : ""}`}
          onClick={onClose}
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </Link>
      ))}
      {user && dashboardItem && (
        <Link
          to={`/${dashboardItem.page}`}
          className={`flex items-center gap-2 font-medium transition-colors ${
            currentPageName === dashboardItem.page ? "text-emerald-600" : "text-slate-600 hover:text-emerald-600"
          } ${mobile ? "py-3 text-lg" : ""}`}
          onClick={onClose}
        >
          <dashboardItem.icon className="w-4 h-4" />
          {dashboardItem.label}
        </Link>
      )}
    </>
  );

  const initials = user?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 hidden sm:block">GardenHub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <NavItems />
          </nav>

          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto rounded-full">
                    <Avatar className="w-10 h-10 border-2 border-emerald-100">
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <div className="px-3 py-2">
                    <p className="font-medium text-slate-800">{user.full_name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                    <p className="text-xs text-emerald-600 capitalize mt-1">{user.platform_role.replace("_", " ")}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {dashboardItem && (
                    <DropdownMenuItem asChild>
                      <Link to={`/${dashboardItem.page}`} className="flex items-center gap-2">
                        <dashboardItem.icon className="w-4 h-4" />
                        {dashboardItem.label}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={() => console.log("Sign out")}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => console.log("Sign In")}>
                Sign In
              </Button>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[280px]">
                <div className="flex flex-col pt-8">
                  <NavItems mobile onClose={() => {}} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="p-4">{children}</main>

      <footer className="bg-white border-t border-slate-100 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Sprout className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-800">GardenHub</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} GardenHub. Connecting communities through gardens.
          </p>
        </div>
      </footer>
    </div>
  );
}