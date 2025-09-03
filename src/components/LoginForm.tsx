import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Lock, User, AlertCircle, Building2 } from "lucide-react";

export function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [credentials, setCredentials] = useState({
    cliente: "",
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.cliente || !credentials.username || !credentials.password) {
      toast({
        variant: "destructive",
        title: "Required fields",
        description: "Please fill in all fields.",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Login successful!",
        description: "Welcome to the Integration Hub.",
      });
      setIsLoading(false);
      onLogin(); // Call the login handler
    }, 2000);
  };

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

        <Card className="w-full shadow-elevated border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center pb-6">
            <CardTitle className="text-2xl font-semibold">System Access</CardTitle>
            <CardDescription className="text-muted-foreground">
              Log in to access the integration panel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cliente" className="text-sm font-medium">
                  Client
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                  <Select
                    value={credentials.cliente}
                    onValueChange={(value) =>
                      setCredentials({ ...credentials, cliente: value })
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger className="pl-10 h-12 transition-smooth focus:ring-dahua-primary focus:border-dahua-primary">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stralog">Stralog</SelectItem>
                      <SelectItem value="intercomm">Intercomm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={credentials.username}
                    onChange={(e) =>
                      setCredentials({ ...credentials, username: e.target.value })
                    }
                    className="pl-10 h-12 transition-smooth focus:ring-dahua-primary focus:border-dahua-primary"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({ ...credentials, password: e.target.value })
                    }
                    className="pl-10 h-12 transition-smooth focus:ring-dahua-primary focus:border-dahua-primary"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                variant="login" 
                size="lg" 
                className="w-full h-12 text-base"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-accent/20 rounded-lg border border-accent/30">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-dahua-warning flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">Need access?</p>
                  <p className="text-muted-foreground leading-relaxed">
                    To request a new user or reset your password, contact the 
                    <strong> Dahua Technology</strong> company representative.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <p>© 2025 Linqui Tecnologia. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}