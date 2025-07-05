import React from &ldquo;react&rdquo;;
import { CheckCircle2, XCircle } from &ldquo;lucide-react&rdquo;;

export type PasswordStrength = &ldquo;weak&rdquo; | &ldquo;medium&rdquo; | &ldquo;strong&rdquo; | &ldquo;very-strong&rdquo;;

interface PasswordRequirement {
  label: string;
  regex: RegExp;
  met: boolean;
}

interface PasswordStrengthIndicatorProps {
  password: string;
  strength?: number;
  requirements?: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    special: boolean;
  };
}

export function PasswordStrengthIndicator({
  password,
  strength: externalStrength,
  requirements: externalRequirements,
}: PasswordStrengthIndicatorProps) {
  // Define password requirements (only used if external requirements not provided)
  const defaultRequirements: PasswordRequirement[] = [
    {
      label: &ldquo;Al menos 8 caracteres&rdquo;,
      regex: /.{8,}/,
      met: /.{8,}/.test(password),
    },
    {
      label: &ldquo;Al menos una letra mayúscula&rdquo;,
      regex: /[A-Z]/,
      met: /[A-Z]/.test(password),
    },
    {
      label: &ldquo;Al menos una letra minúscula&rdquo;,
      regex: /[a-z]/,
      met: /[a-z]/.test(password),
    },
    {
      label: &ldquo;Al menos un número&rdquo;,
      regex: /[0-9]/,
      met: /[0-9]/.test(password),
    },
    {
      label: &ldquo;Al menos un caracter especial&rdquo;,
      regex: /[^A-Za-z0-9]/,
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  // Merge external requirements with default ones if provided
  const requirements = externalRequirements
    ? [
        { label: &ldquo;Al menos 8 caracteres&rdquo;, met: externalRequirements.length },
        {
          label: &ldquo;Al menos una letra mayúscula&rdquo;,
          met: externalRequirements.uppercase,
        },
        {
          label: &ldquo;Al menos una letra minúscula&rdquo;,
          met: externalRequirements.lowercase,
        },
        { label: &ldquo;Al menos un número&rdquo;, met: externalRequirements.numbers },
        {
          label: &ldquo;Al menos un caracter especial&rdquo;,
          met: externalRequirements.special,
        },
      ]
    : defaultRequirements;

  // Use provided strength or calculate it
  const metRequirementsCount =
    externalStrength !== undefined
      ? externalStrength
      : requirements.filter((req) => req.met).length;

  let strength: PasswordStrength = &ldquo;weak&rdquo;;
  let strengthColor = &ldquo;bg-red-500&rdquo;;
  let strengthWidth = &ldquo;20%&rdquo;;

  if (metRequirementsCount === 5) {
    strength = &ldquo;very-strong&rdquo;;
    strengthColor = &ldquo;bg-green-500&rdquo;;
    strengthWidth = &ldquo;100%&rdquo;;
  } else if (metRequirementsCount === 4) {
    strength = &ldquo;strong&rdquo;;
    strengthColor = &ldquo;bg-blue-500&rdquo;;
    strengthWidth = &ldquo;75%&rdquo;;
  } else if (metRequirementsCount === 3) {
    strength = &ldquo;medium&rdquo;;
    strengthColor = &ldquo;bg-yellow-500&rdquo;;
    strengthWidth = &ldquo;50%&rdquo;;
  } else if (metRequirementsCount === 2) {
    strength = &ldquo;weak&rdquo;;
    strengthColor = &ldquo;bg-orange-500&rdquo;;
    strengthWidth = &ldquo;25%&rdquo;;
  }

  const strengthText = {
    weak: &ldquo;Débil&rdquo;,
    medium: &ldquo;Media&rdquo;,
    strong: &ldquo;Fuerte&rdquo;,
    &ldquo;very-strong&rdquo;: &ldquo;Muy Fuerte&rdquo;,
  };

  return (
    <div className=&ldquo;space-y-2 mt-2&rdquo;>
      <div className=&ldquo;w-full bg-gray-200 h-2 rounded-full overflow-hidden&rdquo;>
        <div
          className={`h-full transition-all duration-300 ${strengthColor}`}
          style={{ width: strengthWidth }}
        />
      </div>

      <div className=&ldquo;text-sm font-medium&rdquo;>
        {password
          ? `Fortaleza: ${strengthText[strength]}`
          : &ldquo;Fortaleza de la contraseña&rdquo;}
      </div>

      <div className=&ldquo;space-y-1.5&rdquo;>
        {requirements.map((requirement, index) => (
          <div key={index} className=&ldquo;flex items-center text-sm&rdquo;>
            {requirement.met ? (
              <CheckCircle2 className=&ldquo;text-green-500 mr-2 h-4 w-4&rdquo; />
            ) : (
              <XCircle className=&ldquo;text-gray-300 mr-2 h-4 w-4&rdquo; />
            )}
            <span
              className={requirement.met ? &ldquo;text-gray-700&rdquo; : &ldquo;text-gray-400&rdquo;}
            >
              {requirement.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
