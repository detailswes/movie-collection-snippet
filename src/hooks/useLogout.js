"use client";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "services/auth";
import { moviesApi } from "services/movies";

export function useLogout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
    dispatch(moviesApi.util.resetApiState());
    router.push("/sign-in");
  };

  return handleLogout;
}
