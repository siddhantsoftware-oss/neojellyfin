import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { apiServerUrl } from "../_main";
import { LoadingSpinner } from "../components/Loading";

function SetupWizard() {
  const updateAddress = useMutation({
    mutationFn: async (newAddress: string) =>
      fetch(`${apiServerUrl}/config/server`, {
        method: "POST",
        body: JSON.stringify({
          ServerAddress: newAddress,
        }),
        credentials: "include",
      }).then((res) => {
        if (!res.ok) {
          throw Error("Could not find server");
        }
      }),
  });

  const client = useQueryClient()

  const logInMutation = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) =>
      fetch(`${apiServerUrl}/config/user`, {
        method: "POST",
        body: JSON.stringify({
          Username: username,
          Pw: password,
        }),
        credentials: "include",
      }),
      onSuccess: ()=> client.invalidateQueries("config")
  });

  const { isError: addressNotAvailable } = useQuery(
    "serverAddress",
    () =>
      fetch(`${apiServerUrl}/config/address`, {
        credentials: "include",
      }).then((res) => {
        if (!res.ok) {
          throw Error("Could not server address");
        } else {
          return res.json();
        }
      }),
    {
      retry: false,
    }
  );

  const [newAddress, setNewAddress] = useState("");
  const [newUsername, setUsername] = useState("");
  const [newPassword, setPassword] = useState("");

  return (
    <div className="h-screen w-full place-items-center justify-center flex">
      <div className="flex flex-col gap-y-3 items-center relative bg-white/20 px-5 py-10 rounded-md backdrop-blur-xl">
        <div className="text-2xl font-semibold">Login</div>
        <div>
          {" "}
          {updateAddress.isSuccess || !addressNotAvailable ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                logInMutation.mutate({
                  password: newPassword,
                  username: newUsername,
                });
              }}
              className="flex flex-col gap-y-3 "
            >
              <input
                value={newUsername}
                type="text"
                placeholder="Username"
                className="bg-accent px-5 py-2 outline-none w-[300px] rounded-md"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                value={newPassword}
                type="password"
                placeholder="Password"
                className="bg-accent px-5 py-2 outline-none w-[300px] rounded-md"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="bg-primary py-1.5 uppercase font-semibold hover:opacity-70 transition rounded-md">
                Sign in
              </button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateAddress.mutate(newAddress);
              }}
              className="flex flex-col gap-y-3 "
            >
              {updateAddress.isError ? (
                <span className="text-red-500 text-center">
                  {(updateAddress.error as Error).message}
                </span>
              ) : null}
              <input
                value={newAddress}
                type="text"
                placeholder="Server Address"
                className="bg-accent px-5 py-2 outline-none w-[300px] rounded-md"
                required
                onChange={(e) => setNewAddress(e.target.value)}
              />
              <button className="bg-primary py-1.5 font-semibold hover:opacity-70 transition rounded-md">
                SUBMIT
              </button>
            </form>
          )}
        </div>
        {updateAddress.isLoading ? (
          <div className="absolute top-0 left-0 bg-[#333333] rounded-md flex place-items-center justify-center w-full h-full">
            <LoadingSpinner />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default SetupWizard;
