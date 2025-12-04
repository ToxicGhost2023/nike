import dynamic from "next/dynamic";

const Welcome = dynamic(() => import("@/components/welcome/Welcome"), {
  ssr: false,
});

export default async function Home() {
  await new Promise((r) => setTimeout(r, 1000));
  return (
    <>
      <Welcome />
    </>
  );
}
