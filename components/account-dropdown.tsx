"use client";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { useAccountStore } from "@/lib/stores/accountStore";

export function AccountDropdown() {
  const { accounts, currentAccount, setAccounts, setCurrentAccount } =
    useAccountStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  const loadAccounts = async () => {
    setLoading(true);
    const extensions = await web3Enable("Password Manager dApp");

    if (extensions.length === 0) {
      alert(
        "No wallet extensions found. Please install Talisman or Polkadot.js Extension."
      );
      setLoading(false);
      return;
    }

    const injectedAccounts = await web3Accounts();
    const mappedAccounts = injectedAccounts.map((acc) => ({
      address: acc.address,
      name: acc.meta.name,
      source: acc.meta.source,
    }));

    setAccounts(mappedAccounts);

    if (!currentAccount && mappedAccounts.length > 0) {
      setCurrentAccount(mappedAccounts[0]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[220px] justify-between">
          {currentAccount
            ? currentAccount.name ?? currentAccount.address
            : "Conectar cuenta"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {accounts.map((account) => (
          <DropdownMenuItem
            key={account.address}
            onClick={() => setCurrentAccount(account)}
          >
            <div className="flex flex-col">
              <span className="font-medium">
                {account.name || account.address.slice(0, 12) + "…"}
              </span>
              <span className="text-xs text-muted-foreground">
                {account.address}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
