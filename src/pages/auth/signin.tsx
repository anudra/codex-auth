import { getProviders, signIn } from "next-auth/react";
import { GetServerSideProps } from "next";

type Props = {
  providers: Record<string, { id: string; name: string }>;
};

export default function SignIn({ providers }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 100 }}>
      <h1>Sign in</h1>
      {Object.values(providers).map((provider) => (
        <div key={provider.id} style={{ margin: 10 }}>
          <button
            onClick={() =>
              signIn(provider.id, { callbackUrl: "/" })
            }
            style={{
              padding: "8px 16px",
              background: "#4285F4",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const providers = await getProviders();
  return {
    props: { providers: providers ?? {} },
  };
};