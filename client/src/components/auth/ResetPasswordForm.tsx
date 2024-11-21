import { useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../api/authSlice";
import { useTheme } from "../contextAPI/ThemeContext";
import { getThemeStyles } from "@/utils/themeUtils";
import { toast } from "react-toastify";
import { CustomError } from "@/misc/error";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { resetPasswordSchema } from "@/validation/resetPasswordSchema";

const ResetPasswordForm = ({ token }: { token: string }) => {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { bgColor, fontColor } = getThemeStyles(theme);

  const handleSubmit = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      await resetPassword({ token, newPassword: values.newPassword }).unwrap();
      navigate("/login");
      toast.success("Password reset successful");
    } catch (error) {
      const err = error as CustomError;
      toast.error(
        "Password reset failed: " +
          (err.data?.message || err.message || "Unknown error")
      );
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75 ${bgColor} ${fontColor}`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Reset Password
        </h3>
        <Formik
          initialValues={{ newPassword: "", confirmPassword: "" }}
          validationSchema={toFormikValidationSchema(resetPasswordSchema)}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values }) => (
            <Form>
              <div className="mt-4">
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <Field
                  name="newPassword"
                  type="password"
                  placeholder="Choose a secure password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />

                {/* Password Recommendations */}
                <div className="mt-2 text-sm text-gray-500">
                  <ul>
                    <li
                      className={
                        values.newPassword.length >= 8 ? "text-green-500" : ""
                      }
                    >
                      - At least 8 characters
                    </li>
                    <li
                      className={
                        /[a-zA-Z]/.test(values.newPassword)
                          ? "text-green-500"
                          : ""
                      }
                    >
                      - Contains a letter
                    </li>
                    <li
                      className={
                        /[0-9]/.test(values.newPassword) ? "text-green-500" : ""
                      }
                    >
                      - Contains a number
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="bg-indigo-600 px-4 py-2 text-white rounded hover:bg-indigo-500"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
