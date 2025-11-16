import dynamic from "next/dynamic";

const Welcome = dynamic(() => import("@/components/landing/Welcome"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Welcome />
    </>
  );
}
