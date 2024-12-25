import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InputWrapperProps {
  children: React.ReactNode;
  label: string;
  error?: string;
  helpText?: string;
}

const InputWrapper = ({ children, label, error, helpText }: InputWrapperProps) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-foreground">{label}</label>
    <div className="relative">
      {children}
    </div>
    {helpText && (
      <p className="text-sm text-muted-foreground">{helpText}</p>
    )}
    {error && (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}
  </div>
);

export default InputWrapper;