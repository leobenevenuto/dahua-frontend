import { LoginForm } from "@/components/LoginForm";

const Index = ({ onLogin }: { onLogin: () => void }) => {
  return <LoginForm onLogin={onLogin} />;
};

export default Index;
