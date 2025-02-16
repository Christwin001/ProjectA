import { signIn } from "@/auth";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  Alert,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AuthError } from "next-auth";
import { cookies } from "next/headers";
import NextLink from "next/link";
import { redirect } from "next/navigation";

async function authenticate(username: string, password: string) {
  try {
    const res = await signIn("credentials", {
      username,
      password,
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

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const csrfToken = cookies().get("authjs.csrf-token")?.value ?? "";

  const login = async (data: FormData) => {
    "use server";

    const username = data.get("username") as string;
    const password = data.get("password") as string;

    if (!username || !password) {
      redirect("/login?message=Please provide both email and password");
    }

    const error = await authenticate(username, password);

    if (error) {
      redirect(`/login?message=${encodeURIComponent(error)}`);
    }

    redirect("/app");
  };

  return (
    <Stack gap={8}>
      <Heading textStyle="xl" fontWeight="bold" textAlign="center">
        Login
      </Heading>
      <Stack gap={4}>
        <form action={login}>
          <VStack gap={6} alignItems="flex-start">
            <VStack gap={1} w="100%" alignItems="flex-start">
              <Field label="Email" required>
                <Input id="username" name="username" type="email" />
              </Field>
            </VStack>
            <VStack gap={1} w="100%" alignItems="flex-start">
              <Field label="Password" required>
                <PasswordInput id="password" name="password" />
              </Field>
            </VStack>
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <SubmitButton w="100%" type="submit">
              Login
            </SubmitButton>
            <HStack w="100%" gap={1} justify="center">
              <Text textStyle="sm" color="fg.muted">
                No account yet?
              </Text>
              <Link asChild textStyle="sm">
                <NextLink href="/signup">Sign up</NextLink>
              </Link>
            </HStack>
          </VStack>
        </form>
        {searchParams.message && (
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
