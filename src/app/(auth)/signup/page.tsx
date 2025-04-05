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
import { Link as NextLink } from "next-view-transitions";
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

async function authenticate(payload: {
  email: string;
  password: string;
  last_name: string;
  first_name: string;
  organisation_name: string;
}) {
  const { email, password, first_name, last_name, organisation_name } = payload;

  try {
    const response = await apiClient.auth.register({
      email,
      password,
      last_name,
      first_name,
      organisation_name,
    });
    await fetch(`${process.env.API_URL}/api/create-cal-managed-user`, {
      method: "POST",
      body: JSON.stringify({
        email,
        userId: response.user.id,
        timeZone: "Africa/Lagos",
        name: `${first_name} ${last_name}`,
      }),
    });
    const res = await signIn("credentials", {
      password,
      username: email,
      redirect: false,
    });

    return res?.error;
  } catch (error) {
    console.log(error);
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
    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;
    const organisation_name = formData.get("organisation_name") as string;

    if (!email || !password) {
      redirect("/signup?message=Please provide both email and password");
    }

    const error = await authenticate({
      email,
      password,
      last_name,
      first_name,
      organisation_name,
    });

    if (error) {
      redirect(`/signup?message=${encodeURIComponent(error)}`);
    }

    redirect("/app?filter=assigned");
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
              <HStack w="full">
                <VStack gap={1} w="100%" alignItems="flex-start">
                  <Field label="Your first name" required>
                    <Input type="text" id="first_name" name="first_name" />
                  </Field>
                </VStack>
                <VStack gap={1} w="100%" alignItems="flex-start">
                  <Field label="Your last name" required>
                    <Input type="text" id="last_name" name="last_name" />
                  </Field>
                </VStack>
              </HStack>
              <VStack gap={1} w="100%" alignItems="flex-start">
                <Field label="Your business name" required>
                  <Input
                    type="text"
                    id="organisation_name"
                    name="organisation_name"
                  />
                </Field>
              </VStack>
              <VStack gap={1} w="100%" alignItems="flex-start">
                <Field label="Your email address" required>
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
