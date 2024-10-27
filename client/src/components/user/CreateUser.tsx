import { useCreateUserMutation } from "@/api/userSlice";
import { ConfettiButton } from "../ui/confetti";
import { CustomError } from "@/misc/error";
import { toast } from "react-toastify";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { createUserSchema } from "@/validation/createUserSchema";

interface CreateUserProps {
  role: "user" | "organizer";
  onClose: () => void;
}

const CreateUser = ({ role, onClose }: CreateUserProps) => {
  const [createUser, { isLoading, error }] = useCreateUserMutation();

  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      await createUser({ ...values, role }).unwrap();
      onClose();
      toast.success("User created successfully!");
    } catch (error) {
      const err = error as CustomError;
      toast.error(
        "Error creating user, please try again later! Error: " +
          (err.data?.message || err.message || "Unknown error")
      );
    }
  };

  return (
    <Formik
      initialValues={{ name: "", email: "", password: "" }}
      validationSchema={toFormikValidationSchema(createUserSchema)}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form className="space-y-4 p-6 bg-white rounded-lg">
          <h2 className="text-xl font-semibold text-center mb-4">
            Create {role === "user" ? "User" : "Organizer"} Account
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <Field
              name="name"
              type="text"
              placeholder="Your full name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Field
              name="email"
              type="email"
              placeholder="Your email address"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Field
              name="password"
              type="password"
              placeholder="Choose a secure password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm"
            />

            {/* Password Recommendations */}
            <div className="mt-2 text-sm text-gray-500">
              <ul>
                <li
                  className={
                    values.password.length >= 8 ? "text-green-500" : ""
                  }
                >
                  - At least 8 characters
                </li>
                <li
                  className={
                    /[a-zA-Z]/.test(values.password) ? "text-green-500" : ""
                  }
                >
                  - Contains a letter
                </li>
                <li
                  className={
                    /[0-9]/.test(values.password) ? "text-green-500" : ""
                  }
                >
                  - Contains a number
                </li>
              </ul>
            </div>
          </div>

          <ConfettiButton
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500"
          >
            {isLoading ? "Creating..." : "Create Account"}
          </ConfettiButton>
          {error && (
            <p className="text-red-500 text-sm">
              Error: {JSON.stringify(error)}
            </p>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default CreateUser;
