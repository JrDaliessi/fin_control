import { AuthLoginContainer } from "./AuthLoginContainer";

type LoginRoutePageProps = {
  searchParams: Promise<{
    demo?: string | string[];
  }>;
};

function readDemoCredentials() {
  const email = process.env.FINCONTROL_DEMO_EMAIL?.trim();
  const password = process.env.FINCONTROL_DEMO_PASSWORD;

  if (!email || !password) {
    return undefined;
  }

  return { email, password };
}

export default async function LoginRoutePage({
  searchParams
}: LoginRoutePageProps) {
  const { demo } = await searchParams;
  const initialCredentials = demo === "1" ? readDemoCredentials() : undefined;

  return <AuthLoginContainer initialCredentials={initialCredentials} />;
}
