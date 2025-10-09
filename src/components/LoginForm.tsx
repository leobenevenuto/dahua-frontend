import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Lock, User, AlertCircle, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/authContexts";
import { loginService } from "@/services/login.service";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const [credentials, setCredentials] = useState({
    company: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.company || !credentials.email || !credentials.password) {
      toast({
        variant: "destructive",
        title: "Required fields",
        description: "Please fill in all fields.",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await loginService.login(credentials);
      login(response.token);
      
      toast({
        title: "Login successful!",
        description: "Welcome to the Integration Hub.",
      });
      
      navigate('/product-registration');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
                <Label htmlFor="company" className="text-sm font-medium">
                  Client
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                  <Select
                    value={credentials.company}
                    onValueChange={(value) =>
                      setCredentials({ ...credentials, company: value })
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
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={credentials.email}
                    onChange={(e) =>
                      setCredentials({ ...credentials, email: e.target.value })
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
  );
}