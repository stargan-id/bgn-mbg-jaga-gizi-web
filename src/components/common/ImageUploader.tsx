import { XCircle } from "lucide-react"; // Using lucide-react for icons
import React, { InputHTMLAttributes } from "react";
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormSetValue,
  UseFormWatch
} from "react-hook-form";

// --- Generic ImageUploader Component ---
type ImageUploaderProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  setValue: UseFormSetValue<TFormValues>;
  watch: UseFormWatch<TFormValues>;
  errors: FieldErrors<TFormValues>;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "type">;

// Changed to a standard function declaration to improve generic type inference in JSX
export function ImageUploader<TFormValues extends FieldValues>({
  name,
  setValue,
  watch,
  errors,
  // className is unused, removed to fix lint warning
  multiple,
  ...props
}: ImageUploaderProps<TFormValues>) {
  const errorMessage = errors[name]?.message as string | undefined;
  const currentImages = (watch(name) as string[] | undefined) || [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const imagePromises = Array.from(files).map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const newImages = await Promise.all(imagePromises);
      const updatedImages = multiple
        ? [...currentImages, ...newImages]
        : newImages;
  // We use 'unknown' here and cast to Path<TFormValues> to avoid 'any' and satisfy type safety
  setValue(name, updatedImages as TFormValues[typeof name], { shouldValidate: true });
    } catch (error) {
      console.error("Error reading files:", error);
    }
    // Reset the input value to allow re-uploading the same file
    e.target.value = "";
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = currentImages.filter(
      (_, index) => index !== indexToRemove
    );
  setValue(name, updatedImages as TFormValues[typeof name], { shouldValidate: true });
  };

  const borderColor = errorMessage ? "border-red-500" : "border-gray-300";

  return (
    <div
      className={`w-full p-4 border-2 ${borderColor} border-dashed rounded-lg flex flex-col items-center justify-center`}
    >
      {currentImages.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {currentImages.map((image, index) => (
            <div key={index} className="relative w-20 h-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-white rounded-full text-red-500 hover:text-red-700"
              >
                <XCircle size={24} />
              </button>
            </div>
          ))}
        </div>
      )}
      <label
        htmlFor={name}
        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
      >
        <span>
          {currentImages.length > 0 && multiple
            ? "Add more images"
            : "Upload image(s)"}
        </span>
        <input
          id={name}
          type="file"
          className="sr-only"
          onChange={handleFileChange}
          multiple={multiple}
          {...props}
        />
      </label>
      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
    </div>
  );
}

export default ImageUploader;
