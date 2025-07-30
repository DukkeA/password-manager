import PasswordCreationForm from "@/components/password-creation-form";
import PasswordsTable from "@/components/passwords-table";

export default async function Home() {
  return (
    <>
      <PasswordCreationForm />
      <PasswordsTable />
    </>
  );
}
