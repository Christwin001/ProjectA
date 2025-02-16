import { signIn } from "@/auth";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  Heading,
  Stack,
  Alert,
  VStack,
  Input,
  HStack,
  Text,
  Link,
} from "@chakra-ui/react";
import { AuthError } from "next-auth";
import { cookies } from "next/headers";
import NextLink from "next/link";
import { redirect } from "next/navigation";
import { APIClient } from "simpu-api-sdk";

const apiClient = new APIClient({
  ai: "",
  apps: "",
  graph: "",
  inbox: "",
  report: "",
  events: "",
  payment: "",
  notification: "",
  "apps-action": "",
  "knowledge-base": "",
  core: process.env.NEXT_PUBLIC_CORE_API_URL ?? "",
});

async function authenticate(email: string, password: string) {
  try {
    await apiClient.auth.register({
      email,
      password,
      first_name: "",
      last_name: "",
    });
    const res = await signIn("credentials", {
      password,
      username: email,
      redirect: false,
    });

    return res?.error;
  } catch (error) {
    if (error instanceof AuthError) {
      return error.cause?.err?.message;
    }

    return error;
  }
}

export default function Signup({
  searchParams,
}: {
  searchParams: {
    message: string;
    email?: string;
  };
}) {
  const csrfToken = cookies().get("authjs.csrf-token")?.value ?? "";

  const { message, email: prefilledEmail } = searchParams;

  const signUp = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      redirect("/signup?message=Please provide both email and password");
    }

    const error = await authenticate(email, password);

    if (error) {
      redirect(`/signup?message=${encodeURIComponent(error)}`);
    }

    redirect("/app");
  };

  return (
    <Stack gap={8}>
      <Heading textStyle="xl" fontWeight="bold" textAlign="center">
        Get started
      </Heading>
      <Stack gap={4}>
        <Stack>
          <form style={{ width: "100%" }} action={signUp}>
            <VStack gap={6} alignItems="flex-start">
              <VStack gap={1} w="100%" alignItems="flex-start">
                <Field label="Email" required>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    disabled={!!prefilledEmail}
                    defaultValue={prefilledEmail}
                  />
                </Field>
              </VStack>
              <VStack gap={1} w="100%" alignItems="flex-start">
                <Field label="Password" required>
                  <PasswordInput id="password" name="password" />
                </Field>
              </VStack>
              <input type="hidden" name="csrfToken" value={csrfToken} />
              <SubmitButton w="100%">Sign up</SubmitButton>
              <HStack w="100%" gap={1} justify="center">
                <Text fontSize="sm" color="fg.muted">
                  Already have an account?
                </Text>
                <Link asChild textStyle="sm">
                  <NextLink href="/login">Log in</NextLink>
                </Link>
              </HStack>
            </VStack>
          </form>
        </Stack>
        {message && (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Error</Alert.Title>
              <Alert.Description>{searchParams.message}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}
      </Stack>
    </Stack>
  );
}
