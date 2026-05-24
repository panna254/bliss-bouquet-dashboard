import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const UserMenu = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/", { replace: true });
    } catch (error) {
      // Logout failures are non-fatal for this menu.
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-muted">
          {user?.name || user?.email ? (
            <Avatar>
              <AvatarFallback>{(user.name ?? user.email ?? "U")[0]}</AvatarFallback>
            </Avatar>
          ) : (
            <User className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {user ? (
          <>
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{user.name ?? user.email}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate("/account")}>Account</DropdownMenuItem>
            <DropdownMenuItem onSelect={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4 inline" />
              Sign out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4 inline" />
                Sign in
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/signup">Create account</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
