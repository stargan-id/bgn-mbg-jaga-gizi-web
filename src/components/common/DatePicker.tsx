import { InputHTMLAttributes } from 'react';
import { FieldErrors, FieldValues, Path, UseFormRegister, UseFormWatch } from 'react-hook-form';


// --- Helper Function ---
// This function formats a value (string or Date object) into 'yyyy-MM-dd' for the date input.
const formatDateForInput = (value: unknown): string => {
  if (!value) return "";

  // If it's already a valid date string, return it
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  
  // Try to create a date object from the value
  const date = new Date(value as string | Date);
  
  // Check if the created date is valid
  if (!isNaN(date.getTime())) {
    // Convert to ISO string (e.g., "2023-10-27T10:00:00.000Z") and take the date part.
    return date.toISOString().slice(0, 10);
  }

  // Return empty if the date is invalid
  return "";
};

// --- Generic TypeScript Props for the Component ---
// We use a generic <TFormValues> to make the component reusable with any form schema.
// `Path<TFormValues>` is a utility type from react-hook-form for type-safe field names.
type DatePickerProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  register: UseFormRegister<TFormValues>;
  watch: UseFormWatch<TFormValues>;
  errors: FieldErrors<TFormValues>;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'name'>;

// --- Reusable DatePicker Component ---
// The component itself is now a generic function.
export const DatePicker = <TFormValues extends FieldValues>({
  name,
  register,
  watch,
  errors,
  className = '',
  ...props
}: DatePickerProps<TFormValues>) => {
  // We use type assertion here because the generic nature makes it hard for TS to infer the exact error message type.
  const errorMessage = errors[name]?.message as string | undefined;
  const watchedValue = watch(name);

  // Determine border color based on error state
  const borderColor = errorMessage ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500";

  return (
      <input
        id={name}
        type="date"
        value={formatDateForInput(watchedValue)}
        className={`w-full rounded-lg border px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 ${borderColor} ${className}`}
        // Register the input with React Hook Form
        {...register(name, {
          // Convert the input's string value ("yyyy-MM-dd") back to a Date object
          // or undefined if the input is cleared.
          setValueAs: (value) => (value ? new Date(value) : undefined),
        })}
        {...props}
      />
  );
};


export default DatePicker;