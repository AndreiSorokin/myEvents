import { useState } from "react";
import { useLoginMutation } from "@/api/authSlice";
import { useNavigate } from "react-router-dom";
import { CreateAccountModal } from "../user/CreateAccountModal";
import RequestForgotPasswordModal from "./ForgotPasswordModal";
import { useTheme } from "../contextAPI/ThemeContext";
import { getThemeStyles } from "@/utils/themeUtils";
import { toast } from "react-toastify";
import { CustomError } from "@/misc/error";
import GoogleLoginButton from "./GoogleLoginButton";
import { Button } from "@/components/ui/buttonShadcn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import logo from "../../img/logo.png";

export default function Login() {
  const { theme } = useTheme();
  const { bgColor, fontColor } = getThemeStyles(theme);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] =
    useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        toast.info("Please fill in all fields");
        return;
      }
      await login({ email, password }).unwrap();
      toast.success("Login successful!");
      navigate("/events");
    } catch (error) {
      const err = error as CustomError;
      toast.error(
        "Login failed: " + (err.data?.message || err.message || "Unknown error")
      );
    }
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center p-4 ${bgColor} ${fontColor}`}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <img src={logo} alt="Company Logo" className="h-20 w-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Sign in to your account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button
                  variant="link"
                  className="px-0 font-normal"
                  onClick={() => setIsForgotPasswordModalOpen(true)}
                >
                  Forgot password?
                </Button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="flex justify-center">
            <GoogleLoginButton />
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
          </div>
          <Button
            variant="outline"
            onClick={() => setIsCreateAccountModalOpen(true)}
          >
            Create an account
          </Button>
        </CardFooter>
      </Card>

      <RequestForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
      />

      <CreateAccountModal
        isOpen={isCreateAccountModalOpen}
        onClose={() => setIsCreateAccountModalOpen(false)}
      />
    </div>
  );
}
