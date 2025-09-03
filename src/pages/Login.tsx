import { LoginForm } from "@/components/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-secondary/10 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute top-10 right-10 w-48 h-48 bg-secondary/25 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex justify-center">
            <img 
              src="/dahua-logo.png" 
              alt="Dahua Technology" 
              className="h-12 w-auto object-contain"
            />
          </div>
        </div>

        <LoginForm />

        <div className="text-center text-xs text-muted-foreground">
          <p>© 2025 Linqui Tecnologia. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
