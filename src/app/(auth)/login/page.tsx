import { LoginForm } from "@/components/auth/LoginForm";
import { Briefcase } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Briefcase className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Job Hunt</h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
