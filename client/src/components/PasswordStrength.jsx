import { validatePassword, getPasswordStrengthColor, getPasswordStrengthWidth } from '../utils/validation';

const PasswordStrength = ({ password }) => {
  if (!password) return null;

  const { score, strength, errors } = validatePassword(password);

  const strengthColors = {
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500',
  };

  const strengthLabels = {
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
  };

  return (
    <div className="mt-2">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strengthColors[strength]}`}
          style={{ width: getPasswordStrengthWidth(score) }}
        />
      </div>

      {/* Strength Label */}
      <div className="flex justify-between items-center mt-1">
        <span className={`text-sm font-medium ${getPasswordStrengthColor(strength)}`}>
          {strengthLabels[strength]}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {score}/7
        </span>
      </div>

      {/* Validation Errors/Suggestions */}
      {errors.length > 0 && (
        <ul className="mt-2 space-y-1">
          {errors.map((error, index) => (
            <li key={index} className="text-xs text-red-600 dark:text-red-400 flex items-start">
              <span className="mr-1">•</span>
              <span>{error}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Success Message */}
      {errors.length === 0 && strength === 'strong' && (
        <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Password strength is good!
        </p>
      )}
    </div>
  );
};

export default PasswordStrength;
