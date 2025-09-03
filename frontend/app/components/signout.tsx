import { useRouter } from "next/navigation";

export default function Signout() {
  const router = useRouter();
  // LIST OF PAYLOAD TYPES
  const onClick = () => {
    router.push(`/signup`);
  };

  return (
    <div>
      {" "}
      <button className="rounded-sm p-1 bg-[var(--button)]" onClick={onClick}>
        {" "}
        Sign out
      </button>
    </div>
  );
}
