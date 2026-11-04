import { useCallback, useEffect, useState } from "react";
import { PublicShell } from "../components/layout/PublicShell";
import { LandingPage } from "../pages/LandingPage";
import { AuthPage } from "../pages/AuthPage";
import { AccountPage } from "../pages/AccountPage";
import { IntegrationDocsPage } from "../pages/IntegrationDocsPage";
import { authApi } from "../services/authApi";

const sessionKey = "renaper-session";
const pageFromPath = () =>
  window.location.pathname === "/registro"
    ? "register"
    : window.location.pathname === "/login"
      ? "login"
      : window.location.pathname === "/cuenta"
        ? "account"
        : window.location.pathname === "/documentacion"
          ? "documentation"
          : "home";

export default function App() {
  const [page, setPage] = useState(pageFromPath);
  const [session, setSession] = useState(null);
  const [notice, setNotice] = useState("");
  const [isRestoring, setIsRestoring] = useState(() =>
    Boolean(localStorage.getItem(sessionKey)),
  );
  useEffect(() => {
    const saved = localStorage.getItem(sessionKey);
    if (!saved) {
      setIsRestoring(false);
      return;
    }
    let restored;
    try {
      restored = JSON.parse(saved);
    } catch {
      localStorage.removeItem(sessionKey);
      setIsRestoring(false);
      return;
    }
    authApi
      .me(restored.accessToken)
      .then((profile) => setSession({ ...restored, profile }))
      .catch(() => localStorage.removeItem(sessionKey))
      .finally(() => setIsRestoring(false));
  }, []);
  useEffect(() => {
    const onPopState = () => setPage(pageFromPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  useEffect(() => {
    if (page !== "account" || session || isRestoring) return;
    window.history.replaceState({}, "", "/login");
    setNotice("Iniciá sesión para gestionar tu cuenta.");
    setPage("login");
  }, [isRestoring, page, session]);
  function navigate(nextPage) {
    setNotice("");
    window.history.pushState(
      {},
      "",
      nextPage === "register"
        ? "/registro"
        : nextPage === "login"
          ? "/login"
          : nextPage === "account"
            ? "/cuenta"
            : nextPage === "documentation"
              ? "/documentacion"
              : "/",
    );
    setPage(nextPage);
  }
  async function authenticate(credentials) {
    const login = await authApi.login(credentials);
    const profile = await authApi.me(login.accessToken);
    const nextSession = { ...login, profile };
    localStorage.setItem(sessionKey, JSON.stringify(nextSession));
    setSession(nextSession);
    navigate("home");
  }
  async function register(values) {
    await authApi.register(values);
    try {
      await authenticate(values);
    } catch {
      navigate("login");
      setNotice("La cuenta fue creada. Iniciá sesión para continuar.");
    }
  }
  async function logout() {
    const currentSession = session;
    setSession(null);
    localStorage.removeItem(sessionKey);
    navigate("home");
    if (currentSession)
      await authApi.logout(currentSession.accessToken).catch(() => {});
  }
  const updateProfile = useCallback((profile) => {
    setSession((current) => {
      if (!current) return current;
      const nextSession = { ...current, profile };
      localStorage.setItem(sessionKey, JSON.stringify(nextSession));
      return nextSession;
    });
  }, []);
  return (
    <PublicShell
      session={session}
      page={page}
      onNavigate={navigate}
      onLogout={logout}
    >
      {page === "register" && (
        <AuthPage mode="register" onSubmit={register} onNavigate={navigate} />
      )}
      {page === "login" && (
        <AuthPage
          mode="login"
          onSubmit={authenticate}
          onNavigate={navigate}
          notice={notice}
        />
      )}
      {page === "account" && session && (
        <AccountPage
          session={session}
          onSessionProfile={updateProfile}
          onNavigate={navigate}
        />
      )}
      {page === "documentation" && <IntegrationDocsPage />}
      {page === "home" && (
        <LandingPage session={session} onNavigate={navigate} />
      )}
    </PublicShell>
  );
}
