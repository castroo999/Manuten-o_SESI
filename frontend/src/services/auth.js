export function userFromToken(token) {
  try {
    const payload = token?.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    const user = JSON.parse(decoded);

    return user?.user
      ? { id: user.id, user: user.user, email: user.email, role: user.role }
      : null;
  } catch {
    return null;
  }
}

export function readStoredUser() {
  try {
    const stored = JSON.parse(localStorage.getItem("user") || "null");
    if (stored && typeof stored === "object" && stored.user) return stored;
  } catch {
    // A sessão antiga pode conter o texto "undefined". Recupera os dados do JWT abaixo.
  }

  const user = userFromToken(localStorage.getItem("token"));
  if (user) localStorage.setItem("user", JSON.stringify(user));
  return user;
}
