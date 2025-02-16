import { AlertTriangle } from "lucide-react";
import { cookies, headers } from "next/headers";
import NextLink from "next/link";
import { redirect } from "next/navigation";
import { Stack, VStack } from "styled-system/jsx";
import { SubmitButton } from "~/components/submit-button";
import * as Alert from "~/components/ui/alert";
import { FormLabel } from "~/components/ui/form-label";
import { Heading } from "~/components/ui/heading";
import { Link } from "~/components/ui/link";
import { PasswordInput } from "~/components/ui/password-input";
import { Text } from "~/components/ui/text";
import { createClient } from "~/utils/supabase/server";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const headersList = headers();
  const host = headersList.get("host");

  const updatePassword = async (formData: FormData) => {
    "use server";

    const password = formData.get("password") as string;

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return redirect(
        "/reset-password?message=Could not reset your password. Please try again."
      );
    }

    return redirect("/login");
  };

  return (
    <Stack gap={8}>
      <Stack>
        <Heading textStyle="xl" fontWeight="bold" textAlign="center">
          Reset Your Password?
        </Heading>
        <Text textAlign="center" textStyle="sm">
          Fill in your new password below.
        </Text>
      </Stack>
      <form action={updatePassword} style={{ width: "100%" }}>
        <Stack gap={6}>
          <VStack gap={1} w="100%" alignItems="flex-start">
            <FormLabel htmlFor="password">Your New Password</FormLabel>
            <PasswordInput id="password" name="password" />
          </VStack>
          <SubmitButton>Reset password</SubmitButton>
          <Link display="block" asChild textStyle="sm" textAlign="center">
            <NextLink href="/login">Back to log in</NextLink>
          </Link>
        </Stack>
      </form>

      {searchParams?.message && (
        <Alert.Root>
          <Alert.Icon asChild>
            <AlertTriangle />
          </Alert.Icon>
          <Alert.Content>
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>{searchParams.message}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}
    </Stack>
  );
}
